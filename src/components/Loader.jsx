import React from "react";
import "../styles/Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <svg
        className="pl"
        viewBox="0 0 160 160"
        width="160"
        height="160"
        role="img"
        aria-label="Colorful rotating loader"
      >
        <g
          fill="none"
          transform="translate(80, 80) rotate(-90)"
          strokeDasharray="1 1"
        >
          <g className="pl__blend" transform="rotate(-35)">
            <circle className="pl__curve pl__curve--rotate1 pl__curve--cyan" pathLength="1" r="73" strokeWidth="7" strokeDashoffset="0.75" />
          </g>
          <g className="pl__blend" transform="rotate(45)">
            <circle className="pl__curve pl__curve--rotate2 pl__curve--magenta" pathLength="1" r="73" strokeWidth="9" strokeDashoffset="0.8" />
          </g>
          <g className="pl__blend" transform="rotate(-57)">
            <circle className="pl__curve pl__curve--rotate3 pl__curve--yellow" pathLength="1" r="48" strokeWidth="13" strokeDashoffset="0.58" />
          </g>
          <g className="pl__blend" transform="rotate(28)">
            <circle className="pl__curve pl__curve--rotate4 pl__curve--magenta" pathLength="1" r="48" strokeWidth="8" strokeDashoffset="0.77" />
          </g>
          <g className="pl__blend" transform="rotate(-120)">
            <circle className="pl__curve pl__curve--rotate5 pl__curve--yellow" pathLength="1" r="27" strokeWidth="7" strokeDashoffset="0.73" />
          </g>
          <g className="pl__blend" transform="rotate(-10)">
            <circle className="pl__curve pl__curve--rotate6 pl__curve--cyan" pathLength="1" r="25" strokeWidth="8" strokeDashoffset="0.77" />
          </g>
          <g className="pl__blend" transform="rotate(145)">
            <circle className="pl__curve pl__curve--rotate7 pl__curve--cyan" pathLength="1" r="26" strokeWidth="8" strokeDashoffset="0.85" />
          </g>
          <g className="pl__blend" transform="rotate(43)">
            <circle className="pl__curve pl__curve--rotate8 pl__curve--magenta" pathLength="1" r="26" strokeWidth="14" strokeDashoffset="0.54" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Loader;
