# John Deere 425 battery issue

## From Gemini:

The John Deere 425 (a 1990s-era garden tractor with Kawasaki liquid-cooled engine) dying every winter is a classic symptom with a very small number of root causes. Let's reason from first principles — what actually kills a lead-acid battery over months of sitting unused:

1\. Self-discharge — even with zero external load, a typical lead-acid battery loses ~3–15% of charge per month at room temperature. In cold weather this slows down, but if it's already partially discharged, it drops below ~12.0–12.1 V quickly.

2\. Sulfation — the real killer. When voltage sits below ~12.4 V for weeks/months, lead sulfate crystals harden on the plates. Hard sulfation is mostly irreversible → capacity drops permanently, and the battery "dies" (won't take/hold charge or crank). Cold accelerates the damage once it's sulfated.

3\. Parasitic current draw — something on the tractor keeps pulling 10–100+ mA even with key off → over 3–6 months this flattens the battery completely, then sulfation finishes the job.

4\. Cold temperature compounding — if stored below freezing and already low on charge, electrolyte can freeze → cracks plates → instant death on next attempt to charge/use.

5\. Charging system never fully recovers it — if the stator/regulator only marginally works, short spring/summer runs never get the battery back to 100% → it enters winter already weak.

### Step-by-step debug plan (from root → leaf)

#### Step 1 — Prove whether the battery itself is still healthy

-   ​Fully charge it off the tractor using a good smart charger (Battery Tender, NOCO Genius, Schumacher, etc.) on the normal or AGM mode (not desulfation mode yet).
-   Let it sit disconnected for 12–24 hours.
-   Measure open-circuit voltage:  
    ≥ 12.65 V = healthy & charged  
    12.4–12.6 V = partially sulfated / weak  
    < 12.2 V after full charge = bad battery (replace)
-   Load test it (most auto parts stores do this free) or check cranking voltage while attempting to start → should not drop below ~9.6–10 V during cranking.

If it fails here → battery is toast (most common winter death on 425s). Replace with fresh Group 51 battery (U1 size, ~300–400 CCA). Don't keep patching old ones.

#### Step 2 — Measure parasitic draw (the #1 hidden killer on 425/445 series)

Tools needed: digital multimeter that can read mA (milliamps) accurately.

Procedure:

1.  Fully charge battery, install it, make sure everything is off (key off, lights off, PTO off, hood down so safety switches are happy).
2.  Disconnect the negative battery cable.
3.  Set multimeter to DC amps (10 A range first).
4.  Put meter between negative post and negative cable (series connection).
5.  Wait 5–10 minutes (modules time out, capacitors discharge).
6.  Read current draw.

Acceptable on a 425: < 15–25 mA (0.015–0.025 A)  

Problematic: > 50 mA → will drain battery flat in 2–4 months  

Severe: > 100 mA → dead in we

  

If draw is high:

-   ​Pull fuses one by one (look at fuse box diagram in operator manual) while watching meter.
-   Common culprits on 425:  
    \- Time delay module (the black box that keeps fuel solenoid alive briefly after shutdown — fails and leaks current)  
    \- Aftermarket accessories (radio, lights, USB charger)  
    \- Faulty key switch  
    \- Short in wiring harness (rubbed through near frame/engine)  
    \- Voltage regulator/diode leaking backward

#### Step 3 — Verify charging system (prevents reoccurrence)

Run engine at ~3000 RPM for 5–10 min.

Measure voltage at battery terminals:

-   ​13.8 – 14.4 V = good
-   < 13.5 V = weak charging (stator, voltage regulator, bad connections, blown fuse)
-   \> 15 V = overcharging (kills batteries fast)

The 425 uses a permanent-magnet alternator + separate regulator. Regulators fail commonly after 20–30 years.

#### Step 4 — Winter storage root fix (prevent next year)

Choose one of these (ranked most effective → least):

| Method | Why it works from first principles | Effort/Cost |
| --- | --- | --- |
| Remove battery & bring indoors + put on smart maintainer | Eliminates all parasitic draw + prevents sulfation + no freeze risk | Medium / $40–80 |
| Leave in tractor + connect maintainer (Battery Tender style) all winter | Keeps 100% charge continuously → zero sulfation risk | Low / $40–80 |
| Trickle charge every 2–4 weeks (manual charger) | Counteracts self-discharge | High (remembering) |
| Do nothing (current method) | Almost guarantees death every 3–5 years | \-- |

Bottom line — 90%+ of the time on a 425 sitting unused all winter it's not "the cold killed it". It's sitting partially discharged → sulfation, usually helped along by small parasitic draw or no maintainer. Fix the draw if present, then use a maintainer religiously during storage.

Start with the parasitic draw test — it's quick, free (if you have a multimeter), and often reveals the smoking gun. Let me know what current you measure or what the charged voltage is — we can narrow it further from there.
