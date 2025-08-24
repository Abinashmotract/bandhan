import { useEffect, useRef } from "react";

export default function ClickSpark({ color }) {
  const sparkRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!sparkRef.current) return;

      const svg = sparkRef.current.querySelector("svg");
      const sparks = [...svg.children];

      // Position spark
      sparkRef.current.style.left = e.pageX - sparkRef.current.clientWidth / 2 + "px";
      sparkRef.current.style.top = e.pageY - sparkRef.current.clientHeight / 2 + "px";

      // Animate spark lines
      const size = parseInt(sparks[0].getAttribute("y1"));
      const offset = size / 2 + "px";

      const keyframes = (i) => {
        const deg = `calc(${i} * (360deg / ${sparks.length}))`;
        return [
          {
            strokeDashoffset: size * 3,
            transform: `rotate(${deg}) translateY(${offset})`,
          },
          {
            strokeDashoffset: size,
            transform: `rotate(${deg}) translateY(0)`,
          },
        ];
      };

      const options = {
        duration: 660,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards",
      };

      sparks.forEach((spark, i) => spark.animate(keyframes(i), options));
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={sparkRef}
      style={{
        position: "absolute",
        pointerEvents: "none",
        color: color || "currentColor",
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 100 100"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        stroke={color || "currentColor"}
        style={{ transform: "rotate(-20deg)" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="30"
            x2="50"
            y2="4"
            strokeDasharray="30"
            strokeDashoffset="30"
            style={{ transformOrigin: "center" }}
          />
        ))}
      </svg>
    </div>
  );
}
