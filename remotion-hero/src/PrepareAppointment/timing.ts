// Timeline beats for the Prepare Appointment loop. 30fps.

export const FPS = 30;

export const T = {
  enterEnd: 30,        // 1.0s — header + tip + blank cards staggered in
  questionsInEnd: 60,  // 2.0s — all 6 question rows visible

  check1: 78,          // 2.6s — first question gets ticked
  check2: 102,         // 3.4s
  check3: 132,         // 4.4s
  check4: 162,         // 5.4s

  buttonPulseStart: 180, // 6.0s — CTA pulses
  buttonPulseEnd: 210,   // 7.0s

  holdEnd: 270,        // 9.0s hold
  fadeOutEnd: 300,     // 10.0s fade to white -> loops cleanly
} as const;

export const TOTAL_FRAMES = T.fadeOutEnd;
