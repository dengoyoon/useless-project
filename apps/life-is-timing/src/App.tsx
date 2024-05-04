import { useEffect, useRef, useState } from "react";

const useTimer = () => {
  const [time, setTime] = useState(0);
  const requestRef = useRef(0);
  const animate = (t: DOMHighResTimeStamp) => {
    setTime(t);
    console.log(t);
    requestRef.current = requestAnimationFrame(animate);
  };
  const start = () => requestAnimationFrame(animate);
  const stop = () => cancelAnimationFrame(requestRef.current);
  const reset = () => {
    setTime(0);
  };
  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return { time, start, stop, reset };
};

function App() {
  const { time, start, stop } = useTimer();
  return (
    <>
      <div>{time}</div>
      <div>
        <button onClick={() => start()}>Start</button>
        <button onClick={() => stop()}>Stop</button>
        <button>Reset</button>
      </div>
    </>
  );
}

export default App;
