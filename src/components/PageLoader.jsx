"use client";

import { useGSAP } from "@gsap/react";
import React, { useState, useRef, useEffect } from "react";
import styles from "./PageLoader.module.css";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

function LoadingPage() {
  return <section className={styles.loader}>I&apos;m Loading Bruh</section>;
}

export default function PageLoader({ children }) {
  const [isLoading, setLoading] = useState(true);
  const [isActuallyLoading, setActuallyLoading] = useState(true);

  useEffect(() => {
    const onPageLoad = () => {
      console.log("pge loaded")
      setActuallyLoading(false);
    }

    const timeoutID = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // check if page is actually loading, 
    // pass that along as a prop to child comps
    if (document.readyState == 'complete') { 
      onPageLoad(); 
    } else {
      window.addEventListener('load', onPageLoad, false);
    }

    return () => {
      clearTimeout(timeoutID);
      window.removeEventListener('load', onPageLoad);
    }
  }, []);

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        pageloading: isLoading,
        actualLoading: isActuallyLoading
      });
    });
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingPage />}
      {renderChildren()}
    </React.Fragment>
  );
}
