
const RAKE_PERCENT = 10.0;
const ENTRY_FEE = 5;

function calculateDistribution(userCount) {
    const grossPot = userCount * ENTRY_FEE;
    const rakeAmount = grossPot * (RAKE_PERCENT / 100);
    const netPot = grossPot - rakeAmount;

    console.log(`\n--- SIMULATION: ${userCount} Users @ $${ENTRY_FEE} Entry ---`);
    console.log(`Gross Pot: $${grossPot.toFixed(2)}`);
    console.log(`Net Pot (after ${RAKE_PERCENT}% fee): $${netPot.toFixed(2)}`);

    const top25Count = Math.ceil(userCount * 0.25);
    console.log(`Winners (Top 25%): ${top25Count} users`);

    // Top 3 Fixed
    const p1 = netPot * 0.22;
    const p2 = netPot * 0.13;
    const p3 = netPot * 0.095;

    console.log(`1st: $${p1.toFixed(2)}`);
    console.log(`2nd: $${p2.toFixed(2)}`);
    console.log(`3rd: $${p3.toFixed(2)}`);

    // Shared Pot
    const sharedPot = netPot * 0.555;
    const remainingWinners = Math.max(0, top25Count - 3);

    if (remainingWinners > 0) {
        // Tiers
        const top10Count = Math.ceil(userCount * 0.10);
        const top20Count = Math.ceil(userCount * 0.20);

        // High Tier: 4th to Top 10%
        const highStart = 4;
        const highEnd = Math.max(3, top10Count); // Ensure at least 3 to not break if top10 < 4, handled by logic below
        // Actually if top10 < 4, HighTier is empty? 
        // Example: 10 users. Top 25% = 3. 1,2,3. Shared = 0.
        // Example: 20 users. Top 25% = 5. 1,2,3. Shared 2.
        // Top 10% = 2. High End = 2. High Start=4. Loop doesn't run.

        let highCount = 0;
        if (highEnd >= highStart) {
            highCount = highEnd - highStart + 1;
        }

        // Medium Tier: (HighEnd + 1) to Top 20%
        const medStart = highEnd + 1;
        const medEnd = Math.max(highEnd, top20Count);
        let medCount = 0;
        if (medEnd >= medStart) {
            medCount = medEnd - medStart + 1;
        }

        // Base Tier: (MedEnd + 1) to Top 25%
        const baseStart = medEnd + 1;
        const baseEnd = top25Count;
        let baseCount = 0;
        if (baseEnd >= baseStart) {
            baseCount = baseEnd - baseStart + 1;
        }

        // Adjust for Edge Cases where tiers might overlap or be zero
        // The simple math above relies on strict ranges. 
        // High: 4 .. 15
        // Med: 16 .. 30
        // Base: 31 .. 38

        // Validate total count
        const totalCalculated = highCount + medCount + baseCount;
        // console.log(`Debug Check: ${totalCalculated} vs ${remainingWinners}`);

        // Weights
        const W_HIGH = 2.0;
        const W_MED = 1.25; // Adjusted from 1.5 to smooth it out
        const W_BASE = 1.0;

        const totalUnits = (highCount * W_HIGH) + (medCount * W_MED) + (baseCount * W_BASE);
        const unitValue = sharedPot / totalUnits;

        console.log(`Shared Pot: $${sharedPot.toFixed(2)} distributed among ${remainingWinners} users`);

        if (highCount > 0) {
            console.log(`High Tier (${highStart}th - ${highEnd}th) [${highCount} users]: $${(unitValue * W_HIGH).toFixed(2)} each`);
        }
        if (medCount > 0) {
            console.log(`Med Tier (${medStart}th - ${medEnd}th) [${medCount} users]: $${(unitValue * W_MED).toFixed(2)} each`);
        }
        if (baseCount > 0) {
            console.log(`Base Tier (${baseStart}th - ${baseEnd}th) [${baseCount} users]: $${(unitValue * W_BASE).toFixed(2)} each`);
        }
    }
}

calculateDistribution(149);
calculateDistribution(279);
calculateDistribution(40);
calculateDistribution(10);
calculateDistribution(5); // Edge case: < 4 winners
