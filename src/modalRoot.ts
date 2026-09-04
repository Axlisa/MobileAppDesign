import { createContext } from "react";

// Modals (Add habit, Edit profile, Sign out, info sheets, …) are portaled
// here instead of rendering inline inside a screen's own scrollable content
// — otherwise a modal opened while that screen is scrolled down inherits
// its scroll offset and renders shifted off-screen. App.tsx supplies the
// actual DOM node: a div that sits directly inside the phone frame, outside
// any scrolling container, so portaled modals always cover the full frame
// correctly regardless of where the screen underneath is scrolled to.
export const ModalRootContext = createContext<HTMLDivElement | null>(null);
