import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to the top of the page whenever the route (pathname) changes
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use smooth behavior for a nicer UX; change to "auto" if you prefer instant jump
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}