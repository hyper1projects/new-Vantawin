import math

def simulate_hybrid_payouts(participants, entry_fee=10, rake_percent=10):
    gross_pot = participants * entry_fee
    rake_amount = gross_pot * (rake_percent / 100)
    net_pot = gross_pot - rake_amount
    
    print(f"--- Simulation: {participants} Players ---")
    print(f"Net Pot: ${net_pot:,.2f}")

    # Percentages
    p1_pct = 22.0
    p2_pct = 13.0
    p3_pct = 9.5
    remainder_pct = 100 - (p1_pct + p2_pct + p3_pct) # 55.5%

    # Winner Counts
    total_winners = math.ceil(participants * 0.25)
    
    print(f"Total Winners (Top 25%): {total_winners}")
    
    # 1st Place
    if total_winners >= 1:
        print(f"1st Place ({p1_pct}%): ${net_pot * (p1_pct/100):,.2f}")
    
    # 2nd Place
    if total_winners >= 2:
        print(f"2nd Place ({p2_pct}%): ${net_pot * (p2_pct/100):,.2f}")

    # 3rd Place
    if total_winners >= 3:
        print(f"3rd Place ({p3_pct}%): ${net_pot * (p3_pct/100):,.2f}")

    # Remaining Winners (Rank 4 to total_winners)
    remaining_winners_count = total_winners - 3
    
    if remaining_winners_count > 0:
        remainder_pot = net_pot * (remainder_pct / 100)
        per_person = remainder_pot / remaining_winners_count
        print(f"Ranks 4-{total_winners} ({remaining_winners_count} players) Share {remainder_pct}%: ${per_person:,.2f} each")
    else:
        print(f"No Ranks 4+ winners (Pot of {remainder_pct}% distributed to top 3? Or just saved?)")
        # In a real impl, if < 4 winners, we'd probably normalize top 3 to 100% or something.
        # But for 40 players (10 winners), this block will run.

    print("-" * 30)

simulate_hybrid_payouts(146, entry_fee=5)
