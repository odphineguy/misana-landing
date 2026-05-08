// Timeline beats for the Log → Patterns → Doctor Brief loop. 30fps.
// Total: ~17.8s with a tail-fade so the loop hand-off is invisible.

export const FPS = 30;

export const T = {
  // ── Scene A: New Entry form (top) ────────────────────────────────
  formEnterEnd: 18,        // 0.6s — header + chips spring in
  headacheTap: 36,         // 1.2s — Headache chip lights up
  severityTap: 60,         // 2.0s — severity 3 (Moderate) selected
  medsTap: 84,             // 2.8s — Lisinopril toggle taps on

  // ── Scene B: Scroll → Notes → Save ───────────────────────────────
  scrollStart: 102,        // 3.4s — content begins scrolling up
  scrollEnd: 132,          // 4.4s — Notes section in view
  kbUpStart: 130,          // 4.3s — keyboard slides up (overlaps end of scroll)
  kbUpEnd: 154,            // 5.1s — keyboard fully up
  sleepTap: 156,           // 5.2s — +Sleep chip activates
  notesTypeStart: 168,     // 5.6s — typewriter begins
  notesTypeEnd: 282,       // 9.4s — 3.8s of typing at ~3 frames/char (human pace)
  saveButtonEnable: 286,   // 9.5s — Save button transitions enabled
  saveTap: 312,            // 10.4s — Save tap pulse
  toTrackerFadeStart: 324, // 10.8s — fade to next scene
  toTrackerFadeEnd: 342,   // 11.4s

  // ── Scene C: Symptoms tracker ────────────────────────────────────
  trackerEnter: 342,       // 11.4s — tracker page enters
  patternsReveal: 366,     // 12.2s — patterns card details settle
  entriesStart: 408,       // 13.6s — entries stagger in (1.4s dwell on patterns alone)
  entriesEnd: 432,         // 14.4s
  exportTap: 450,          // 15.0s — Export pulses + taps

  // ── Doctor Brief export sheet ────────────────────────────────────
  briefSlideUp: 462,       // 15.4s — sheet slides up from bottom
  briefSettled: 486,       // 16.2s — sheet in place

  // ── Loop tail ────────────────────────────────────────────────────
  holdEnd: 504,            // 16.8s hold final state
  fadeOutEnd: 534,         // 17.8s fade to white → loops cleanly
} as const;

export const TOTAL_FRAMES = T.fadeOutEnd;
