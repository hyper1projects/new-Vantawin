import { PoolPrize } from '../types/pool';

/**
 * Calculates prize distribution for a pool to MATCH BACKEND SQL LOGIC.
 * Supports:
 * 1. Manual JSON Overrides (Fixed Amount or Percentage)
 * 2. 7 Explicit Brackets based on participant count.
 * 3. *SMART* Adjustments: 
 *    - Enforces Top 25% cap on shared tiers to prevent paying 90% of field.
 *    - Checks for Reward Inversion (e.g. 4th > 3rd) and redistributes surplus to Top 3.
 */
export const calculatePoolPrizes = (
    netPot: number,
    participants: number,
    dbDistribution: any[] | null
): PoolPrize[] => {
    // 1. Manual Overrides (Highest Priority)
    if (dbDistribution && dbDistribution.length > 0) {
        return dbDistribution.map((item: any) => {
            let amount = item.amount || 0;
            if (item.percentage !== undefined && item.percentage !== null) {
                amount = netPot * (parseFloat(item.percentage) / 100);
            }
            return {
                rank: item.rank,
                amount: amount,
                badge: 'Custom',
                color: 'text-gray-300'
            };
        });
    }

    if (participants <= 0) return [];

    const rows: PoolPrize[] = [];

    // percentages
    let p1 = 0, p2 = 0, p3 = 0;

    // ranges
    let r1_Start: number | null = null, r1_End: number | null = null, r1_Pct = 0;
    let r2_Start: number | null = null, r2_End: number | null = null, r2_Pct = 0;
    let r3_Start: number | null = null, r3_End: number | null = null, r3_Pct = 0;

    // Tier Badges
    let tierName = '';

    // --- LOGIC MAPPING (Synced with SQL: 20260106110000_smart_bracket_schema.sql) ---

    // Dynamic cutoff based on pool size (30% for small-mid, 25% for others)
    let top25Count = Math.floor(participants * 0.25);
    if (participants >= 11 && participants <= 30) {
        top25Count = Math.floor(participants * 0.30); // 30% for 11-30 pools
    }

    // Bracket 1: 1-9 Users
    if (participants >= 1 && participants <= 9) {
        tierName = 'SMALL';
        p1 = 60; p2 = 40;

        // Bracket 2: 10 Users
    } else if (participants === 10) {
        tierName = 'TEN';
        p1 = 50; p2 = 30; p3 = 20;

        // Bracket 3: 11-30 Users (30% Cutoff)
    } else if (participants >= 11 && participants <= 30) {
        tierName = 'SMALL_MID';
        p1 = 40; p2 = 25; p3 = 15;
        r1_Start = 4; r1_End = top25Count; r1_Pct = 20;

        // Bracket 4: 31-49 Users (25% Cutoff)
    } else if (participants >= 31 && participants <= 49) {
        tierName = 'MID_SMALL';
        p1 = 40; p2 = 25; p3 = 15;
        r1_Start = 4; r1_End = top25Count; r1_Pct = 20;

        // Bracket 5: 50-99 Users
    } else if (participants >= 50 && participants <= 99) {
        tierName = 'MID';
        p1 = 30; p2 = 20; p3 = 10;
        r1_Start = 4; r1_End = 10; r1_Pct = 25;
        r2_Start = 11; r2_End = top25Count; r2_Pct = 15;

        // Bracket 6: 100-499 Users (Rebalanced)
    } else if (participants >= 100 && participants <= 499) {
        tierName = 'LARGE';
        p1 = 15; p2 = 12; p3 = 8;
        r1_Start = 4; r1_End = 10; r1_Pct = 15;
        r2_Start = 11; r2_End = 50; r2_Pct = 30;
        r3_Start = 51; r3_End = top25Count; r3_Pct = 20;

        // Bracket 7: 500-999 Users (Rebalanced)
    } else if (participants >= 500 && participants <= 999) {
        tierName = 'HUGE';
        p1 = 15; p2 = 10; p3 = 6;
        r1_Start = 4; r1_End = 20; r1_Pct = 14;
        r2_Start = 21; r2_End = 100; r2_Pct = 30;
        r3_Start = 101; r3_End = top25Count; r3_Pct = 25;

        // Bracket 8: 1000+ Users (Rebalanced)
    } else {
        tierName = 'MEGA';
        p1 = 12; p2 = 8; p3 = 5;
        r1_Start = 4; r1_End = 20; r1_Pct = 12;
        r2_Start = 21; r2_End = 100; r2_Pct = 33;
        r3_Start = 101; r3_End = top25Count; r3_Pct = 30;
    }


    // --- SAFETY & SURPLUS CHECK ---

    let surplus = 0;
    const SAFETY_FACTOR = 0.90; // Lower tier should be at most 90% of upper tier

    // Helper to process range logic
    const safeCalc = (start: number, end: number, totalPct: number, upperPrize: number): { perUser: number, allocatedPct: number } => {
        if (!start || !end || totalPct <= 0) return { perUser: 0, allocatedPct: 0 };

        // Enforce Top 25% Cap
        // If range is 4-10, end=10. participants=11. top25=2.
        // effectiveEnd = min(10, 2, 11) = 2.
        // effectiveEnd < start (4). count = 0.
        // If participants=40. top25=10. effectiveEnd=min(10, 10, 40) = 10.
        // count = 10-4+1 = 7.

        // Exception: If Range Start > Top 25%, we shouldn't pay anything usually.
        // But for small pools (11-49), Top 25 is small (2-12).

        let effectiveEnd = Math.min(end, participants);
        if (top25Count < end) effectiveEnd = Math.min(effectiveEnd, top25Count);

        let count = 0;
        if (effectiveEnd >= start) {
            count = effectiveEnd - start + 1;
        }

        if (count <= 0) {
            // No winners in this tier -> Entire Percentage is Surplus
            return { perUser: 0, allocatedPct: 0 };
        }

        const rawAmount = netPot * (totalPct / 100);
        let perUser = rawAmount / count;
        let diff = 0;

        // Check against Upper Bound
        if (upperPrize > 0 && perUser > (upperPrize * SAFETY_FACTOR)) {
            const oldPerUser = perUser;
            perUser = upperPrize * SAFETY_FACTOR;
            diff = (oldPerUser - perUser) * count;
            surplus += diff;
        }

        return { perUser, allocatedPct: 0 }; // We only care about perUser val for next tier check
    };

    // Calculate Base Prizes (Top 3) to use as caps
    const baseP1 = netPot * (p1 / 100);
    const baseP2 = netPot * (p2 / 100);
    const baseP3 = netPot * (p3 / 100);

    // Range 1 (High) - Cap against 3rd Place
    let r1_Val = 0;
    if (r1_Start) {
        const res = safeCalc(r1_Start, r1_End!, r1_Pct, baseP3);
        r1_Val = res.perUser;
    }

    // Range 2 (Med) - Cap against Range 1
    let r2_Val = 0;
    if (r2_Start) {
        const res = safeCalc(r2_Start, r2_End!, r2_Pct, r1_Val);
        r2_Val = res.perUser;
    }

    // Range 3 (Base) - Cap against Range 2
    let r3_Val = 0;
    if (r3_Start) {
        const res = safeCalc(r3_Start, r3_End!, r3_Pct, r2_Val);
        r3_Val = res.perUser;
    }

    // --- REDISTRIBUTE SURPLUS ---
    if (surplus > 0) {
        const totalTopW = p1 + p2 + p3;
        if (totalTopW > 0) {
            p1 += (surplus / netPot * 100) * (p1 / totalTopW);
            p2 += (surplus / netPot * 100) * (p2 / totalTopW);
            p3 += (surplus / netPot * 100) * (p3 / totalTopW);
        }
    }


    // --- BUILD ROWS (Final) ---

    // 1st
    if (p1 > 0) {
        rows.push({ rank: '1st', amount: netPot * (p1 / 100), badge: '🏆 Champion', color: 'text-yellow-400', glow: true });
    }
    // 2nd
    if (p2 > 0) {
        rows.push({ rank: '2nd', amount: netPot * (p2 / 100), badge: '🥈 Runner Up', color: 'text-gray-300', glow: false });
    }
    // 3rd
    if (p3 > 0) {
        rows.push({ rank: '3rd', amount: netPot * (p3 / 100), badge: '🥉 Podium', color: 'text-amber-600', glow: false });
    }

    // Helper to calculate exact Range Rows
    const addFinalRow = (start: number, end: number, val: number, badge: string, color: string) => {
        if (val <= 0 || !start || !end) return;

        let finalEnd = Math.min(end, participants);
        if (top25Count < end) finalEnd = Math.min(finalEnd, top25Count);

        if (finalEnd >= start) {
            rows.push({
                rank: finalEnd === start ? `${start}th` : `${start}th - ${finalEnd}th`,
                amount: val,
                badge: badge,
                color: color
            });
        }
    };

    addFinalRow(r1_Start!, r1_End!, r1_Val, 'Elite', 'text-blue-400');
    addFinalRow(r2_Start!, r2_End!, r2_Val, '', 'text-green-400'); // No badge for mid tier
    addFinalRow(r3_Start!, r3_End!, r3_Val, '', 'text-purple-400'); // No badge for base tier

    return rows;
};
