import { useEffect } from "react";

export const useSpaceBarClick = (f: () => void) => {
  useEffect(() => {
    const handleSpaceBarClick = (event: KeyboardEvent) => {
      if (event.key === " ") {
        f();
      }
    };
    window.addEventListener("keydown", handleSpaceBarClick);
    return () => {
      window.removeEventListener("keydown", handleSpaceBarClick);
    };
  }, []);
};
