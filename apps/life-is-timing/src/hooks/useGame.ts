import { useCallback, useMemo, useState } from "react";
import { Level } from "type";

export const useGame = () => {
  const [level, setLevel] = useState<Level>("EASY");
  const goalTime = useMemo(() => Math.floor(Math.random() * 5) + 1, []); // 1 ~ 5의 난수
  const decimalPoint = {
    EASY: 2,
    NORMAL: 4,
    HARD: 8,
  }[level];

  const roundDownDecimalPoint = useCallback(
    (time: number) => {
      const x = Math.pow(10, decimalPoint);
      return Math.trunc(time * x) / x;
    },
    [decimalPoint]
  );

  const displayTime = (time: number) => {
    return roundDownDecimalPoint(time).toFixed(decimalPoint);
  };

  const calculateMistake = (time: number) => {
    return goalTime - roundDownDecimalPoint(time);
  };

  return {
    level,
    goalTime,
    setLevel,
    displayTime,
    calculateMistake,
  };
};
