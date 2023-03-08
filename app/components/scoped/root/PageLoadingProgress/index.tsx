import { useTransition } from "@remix-run/react";
import React from "react";
import { Progress } from "semantic-ui-react";
import { useSpinDelay } from "~/utils/hooks";

let firstRender = true;

function PageLoadingProgress() {
  const transition = useTransition();
  const [value, setValue] = React.useState(0);
  const transitionRef = React.useRef({ value: transition.state });
  const showLoader = useSpinDelay(transition.state === "loading");

  React.useEffect(() => {
    firstRender = false;
  }, []);

  React.useEffect(() => {
    transitionRef.current = { value: transition.state };
  }, [transition]);

  React.useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") return;
    if (!showLoader) return;

    const startTime = Date.now();

    function updateValue() {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(1, elapsedTime / 8000);
      const easedProgress = easeOutQuad(progress);
      const nextValue = Math.round(easedProgress * 100);
      setValue(nextValue);

      if (progress < 1 && transitionRef.current.value === "loading") {
        requestAnimationFrame(updateValue);
      }
    }

    requestAnimationFrame(updateValue);
  }, [showLoader, transition.state]);

  if (!showLoader || value === 0) return null;

  return (
    <Progress
      percent={value}
      attached="top"
      active
      style={{ width: "100vw", zIndex: 100 }}
      color="blue"
    />
  );
}

function easeOutQuad(x: number) {
  return 1 - (1 - x) * (1 - x);
}

export { PageLoadingProgress };
