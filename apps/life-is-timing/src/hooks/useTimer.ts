import { useEffect, useMemo, useRef, useState } from "react";
import { TimerState } from "type";

function* arrayLoopGenerator(arr: Array<() => void>): Generator<() => void> {
  while (true) {
    for (const a of arr) {
      yield a;
    }
  }
}

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const prevTime = useRef<number | null>(null);
  const [timerState, setTimerState] = useState<TimerState>("INIT");
  const requestId = useRef(0);

  const animate = (currentTime: DOMHighResTimeStamp) => {
    if (prevTime.current === null) {
      prevTime.current = currentTime;
    }
    setTime((currentTime - prevTime.current) / 1000);
    requestId.current = requestAnimationFrame(animate);
  };
  const start = () => {
    setTimerState("RUN");
    requestId.current = requestAnimationFrame(animate);
  };
  const stop = () => {
    setTimerState("STOP");
    cancelAnimationFrame(requestId.current);
  };
  const reset = () => {
    prevTime.current = null;
    setTimerState("INIT");
    setTime(0);
  };

  const clickTimer = useMemo(
    () => arrayLoopGenerator([start, stop, reset]),
    []
  );

  useEffect(() => {
    return () => cancelAnimationFrame(requestId.current);
  }, []);

  return { time, timerState, clickTimer };
};
