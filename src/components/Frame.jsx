"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Frame.module.css";
import pageStyles from "../app/(home)/page.module.css"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Frame({ pageloading, actualLoading, children }) {
  const mainContent = useRef();
  const frame = useRef();

  const masterTimeline = useRef();

  var intro = () => {
    let subTimeline = gsap.timeline({ onComplete: (e) => e.current.pause(), onCompleteParams: [masterTimeline]});

    subTimeline
      .to(frame.current, {
        scaleX: 0.2,
        scaleY: 0.05
      }, "intro")
      .to(frame.current, {
        scaleY: 0.2
      }, "zoom")

    return subTimeline;
  }

  // Zoom Out Animation
  var zoomOut = () => {
    let subTimeline = gsap.timeline();

    subTimeline
      .to(frame.current, {
        scale: 1,
        borderWidth: 1,
        duration: 1.5,
        ease: "expo.out",
      }, "zoomOut")
      .to(mainContent.current, {
        opacity: 1,
        duration: 1,
      }, ">-1");

    subTimeline
      .from("#firstHeaderText", {
        y: -20,
        duration: 1,
        opacity: 0,
        ease: "expo.out"
      }, ">-1")
      .from("#secondHeaderText", {
        y: 20,
        duration: 1,
        opacity: 0,
        ease: "expo.out"
      }, ">-1")
      .from(`.${pageStyles.inlineHeader}`, {
        scaleY: 0,
        ease: "expo.out",
        duration: 0.7
      }, ">-1")
      .from("#headerText", {
        opacity: 0,
        duration: 1,
        x: -100,
        ease: "expo.out"
      }, ">-0.2")
      .from(`.${pageStyles.name}`, {
        opacity: 0,
        duration: 1
      }, ">-0.7");
    
    return subTimeline;
  };

  useGSAP(
    () => {
      masterTimeline.current = gsap
        .timeline()
        .add(intro())
        .add(zoomOut());

      if (pageloading) {
        //masterTimeline.current.pause(1.5);
        console.log("paused");
      } else {
        masterTimeline.current.play(1);
        console.log("played");
      }
    },
    { dependencies: [pageloading, frame], scope: mainContent }
  );

  return (
    <React.Fragment>
      <main style={{ opacity: 0 }} ref={mainContent} id={styles.frame}>
        {children}
      </main>
      <div
        style={{ opacity: 1, borderWidth: 4, transform: "scale(0)" }}
        ref={frame}
        id={styles.frameChild}
      ></div>
    </React.Fragment>
  );
}
