// All timings expressed in frames at 30fps. Centralized so the
// composition, screens, keyboard and message bubbles share the same beats.

export const FPS = 30;

export const T = {
  splashStart: 0,
  splashEnd: 36,        // 1.2s splash hold
  splashToHomeEnd: 48,  // 0.4s crossfade

  homeStart: 48,
  homeEnd: 132,         // ~2.8s on home
  homeToChatEnd: 144,   // 0.4s crossfade

  chatStart: 144,
  chatRestEnd: 162,     // welcome bubble visible
  keyboardUpEnd: 180,   // keyboard slides in

  typingStart: 180,
  typingEnd: 276,       // ~3.2s of typing

  sendTapStart: 276,
  sendTapEnd: 282,      // 0.2s send tap pulse
  userBubbleEnd: 294,   // bubble drops in

  aiDotsStart: 294,
  aiDotsEnd: 312,       // 0.6s thinking dots

  aiTypingStart: 312,
  aiTypingEnd: 402,     // 3s typewriter

  holdEnd: 432,         // 1s hold of final state
  fadeOutEnd: 450,      // 0.6s fade to white -> loops into splash
} as const;

export const TOTAL_FRAMES = T.fadeOutEnd;
