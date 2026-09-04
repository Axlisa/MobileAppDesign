// Shared across screens so a habit created during onboarding (or via the
// Home screen's "+" button) is the same object Home, Insights, and Settings
// all read from — instead of each screen keeping its own disconnected copy.
export type Habit = {
  id: number;
  name: string;
  icon: string;
  colorBg: string;
  accent: string;
  streak: number;
  time: string;
  /** true for the 5 built-in demo habits with pre-baked week/month history;
   *  false for anything the user actually created in this session. */
  isSample: boolean;
};
