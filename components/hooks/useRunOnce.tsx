import { useEffect, useRef } from "react";

export function useRunOnce(callback: () => void) {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    callback();
  }, [callback]);
}
