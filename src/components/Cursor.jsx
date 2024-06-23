"use client";

import { useGSAP } from "@gsap/react";
import { useState, useRef, useEffect } from "react";
import styles from "./Cursor.module.css";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Cursor({ pageloading, actualLoading }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [isHovering, setIsHovering] = useState(false);
  const [hoverMultiplier, setHoverMultiplier] = useState(1);

  const cursorContainer = useRef();

  const handleMouseMove = (e) => {
    setPosition({ x: e.pageX, y: e.pageY });

    // holythis is such a dumb idea
    // aight wtv idc
    const target = document.querySelector(".hoverable:hover");
    setIsHovering(target);

    if (target) {
      const hov = target.className.split("hov-x");
      if (hov[1] !== undefined) {
        setHoverMultiplier(new Number(hov[1]));
      } else {
        setHoverMultiplier(1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useGSAP(
    () => {
      if (!pageloading) {
        var hoverMult = 2.0 + 0.5 * hoverMultiplier;
        gsap.to(".largeBall", {
          duration: 0.4,
          x: position.x - 20,
          y: position.y - 20,
          scale: pageloading ? 1 : (isHovering ? hoverMult : 1),
        });

        gsap.to(".smallBall", {
          duration: 0.1,
          x: position.x - 5,
          y: position.y - 7,
        });
      }
    },
    {
      dependencies: [position, isHovering, hoverMultiplier],
      scope: cursorContainer,
    }
  );

  return (
    <div style={{opacity: (pageloading) ? 0 : 1, transition: "opacity .25s ease-out"}} ref={cursorContainer} className={styles.cursor}>
      <div className="largeBall" style={{ transform: "translate(50vw, 50vh)" }}>
        <svg height="60" width="60">
          <circle cx="20" cy="20" r="18" strokeWidth="0"></circle>
        </svg>
      </div>

      <div className="smallBall" style={{ transform: "translate(50vw, 50vh)" }}>
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" strokeWidth="0"></circle>
        </svg>
      </div>
    </div>
  );
}
