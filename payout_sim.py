def simulate_payouts(participants, entry_fee=10, rake_percent=10):
    gross_pot = participants * entry_fee
    rake_amount = gross_pot * (rake_percent / 100)
    net_pot = gross_pot - rake_amount
    
    print(f"--- Simulation: {participants} Players ---")
    print(f"Entry Fee: ${entry_fee}")
    print(f"Gross Pot: ${gross_pot:,.2f}")
    print(f"Rake ({rake_percent}%): -${rake_amount:,.2f}")
    print(f"Net Pot: ${net_pot:,.2f}")
    print("-" * 30)

    # Cutoffs
    top_10_percent_count = int(participants * 0.10)
    top_25_percent_count = int(participants * 0.25)
    
    print(f"Top 10% Rank Cutoff: {top_10_percent_count}")
    print(f"Top 25% Rank Cutoff: {top_25_percent_count}")
    print("-" * 30)

    # Buckets
    # 1. Top 3 (Fixed)
    p1 = net_pot * 0.20
    p2 = net_pot * 0.15
    p3 = net_pot * 0.10
    
    print(f"1st Place (20%): ${p1:,.2f}")
    print(f"2nd Place (15%): ${p2:,.2f}")
    print(f"3rd Place (10%): ${p3:,.2f}")

    # 2. Bucket A (4th to Top 10%)
    # Ranks 4 to top_10_percent_count
    bucket_a_start = 4
    bucket_a_end = max(4, top_10_percent_count) # Ensure at least rank 4 if count is small
    bucket_a_count = (bucket_a_end - bucket_a_start) + 1
    
    if bucket_a_count > 0:
        bucket_a_total = net_pot * 0.30
        bucket_a_per_person = bucket_a_total / bucket_a_count
        print(f"Ranks {bucket_a_start}-{bucket_a_end} ({bucket_a_count} players) Share 30%: ${bucket_a_per_person:,.2f} each")
    else:
        print("Bucket A (Top 10% - Top 3) : No players")

    # 3. Bucket B (Top 10% to Top 25%)
    # Ranks (bucket_a_end + 1) to top_25_percent_count
    bucket_b_start = bucket_a_end + 1
    bucket_b_end = max(bucket_b_start, top_25_percent_count)
    bucket_b_count = (bucket_b_end - bucket_b_start) + 1

    if bucket_b_count > 0 and bucket_b_end >= bucket_b_start:
        bucket_b_total = net_pot * 0.25
        bucket_b_per_person = bucket_b_total / bucket_b_count
        print(f"Ranks {bucket_b_start}-{bucket_b_end} ({bucket_b_count} players) Share 25%: ${bucket_b_per_person:,.2f} each")
    else:
        print("Bucket B (Top 25% - Top 10%): No players")

simulate_payouts(146, entry_fee=5)
