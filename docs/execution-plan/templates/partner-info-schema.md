[Back to Docs Index](../../README.md)

# Partner Info Schema — Basic and Extended Fields

Purpose: Define the minimal (basic) and extended information we should capture consistently about partners (shelters, rescuers, vets/clinics/ambulances, donors, adopters/posters, other orgs). Map fields to a CSV for easy tracking and later import into a CRM.

Usage:
- Use this schema during/after each call. Keep it lightweight during the call; fill extended fields afterward.
- Log each row in `../trackers/partner-info.csv`.
- Record introducer and relationship strength to maintain our warm‑intro referral graph.

## Entities (values for `entity_type`)
- `shelter`, `rescuer`, `vet`, `clinic`, `ambulance`, `adopter`, `donor`, `sponsor`, `ngo`, `gov`, `other`

---

## Basic Fields (minimal during a call)
- `date` (ISO 8601)
- `name`
- `entity_type` (see above)
- `org_legal_name` (if different)
- `city_region`
- `country`
- `languages`
- `contact_primary` (email/phone/preferred)
- `introducer_name`
- `introducer_org`
- `relationship_strength` (1–5)
- `consent_recording` (Y/N)
- `consent_non_pii_quotes` (Y/N)
- `referrals_suggested` (free text or names)
- `notes_short` (1–2 lines)

## Extended Fields (fill as available)
- Ops & Capacity
  - `dogs_in_care_now`
  - `avg_intake_per_month`
  - `adoption_rate_pct`
  - `has_quarantine_area` (Y/N)
  - `transport_available` (Y/N/partner)
- Costs (monthly ranges or typical)
  - `cost_food`
  - `cost_medicine`
  - `cost_vet_care`
  - `cost_transport`
  - `cost_other`
- Vet Access & Pricing
  - `clinics_used`
  - `ambulance_availability` (Y/N/partner)
  - `pricing_common_procedures` (free text; e.g., spay/neuter, vaccinations)
  - `billing_terms`
- Adoption & Virtual Adoption
  - `adoption_screening_summary`
  - `adoption_contracts_in_place` (Y/N)
  - `virtual_adoption_interest` (Y/N)
  - `virtual_adoption_visit_policy`
- Transparency & Evidence Readiness
  - `update_cadence_feasible` (e.g., first update X days, then monthly)
  - `evidence_types_feasible` (photos/videos/receipts/vet_confirmations)
  - `privacy_constraints`
- Funding & Reporting
  - `funding_sources` (donors/grants/EU/corporate/shop/other)
  - `eu_grants_history` (Y/N/which)
  - `reporting_obligations` (frequency, evidence expectations)
- Systems & Tools
  - `systems_used` (spreadsheets/CRM/messaging/tools)
  - `top_gaps`
- Risk & Compliance
  - `kyc_completed` (Y/N/partial)
  - `conflicts_disclosed` (Y/N)
  - `sanctions_screening_ok` (Y/N/na)
- Admin
  - `created_by`
  - `last_updated`
  - `tags`

---

## CSV Mapping (column order)
1. date
2. name
3. entity_type
4. org_legal_name
5. city_region
6. country
7. languages
8. contact_primary
9. introducer_name
10. introducer_org
11. relationship_strength
12. consent_recording
13. consent_non_pii_quotes
14. referrals_suggested
15. notes_short
16. dogs_in_care_now
17. avg_intake_per_month
18. adoption_rate_pct
19. has_quarantine_area
20. transport_available
21. cost_food
22. cost_medicine
23. cost_vet_care
24. cost_transport
25. cost_other
26. clinics_used
27. ambulance_availability
28. pricing_common_procedures
29. billing_terms
30. adoption_screening_summary
31. adoption_contracts_in_place
32. virtual_adoption_interest
33. virtual_adoption_visit_policy
34. update_cadence_feasible
35. evidence_types_feasible
36. privacy_constraints
37. funding_sources
38. eu_grants_history
39. reporting_obligations
40. systems_used
41. top_gaps
42. kyc_completed
43. conflicts_disclosed
44. sanctions_screening_ok
45. created_by
46. last_updated
47. tags

### Notes
- Use `;` to separate list values inside a CSV cell.
- Keep personally identifiable information to a minimum. Redact as needed.
- If a field is unknown, leave blank and fill later.
