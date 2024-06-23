"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Roboto_Mono } from "next/font/google";
import { useGSAP } from "@gsap/react";
import useSWR from "swr";
import useMutation from "swr/mutation";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { horizontalLoop, useIsOverflow } from "./helpers/gsap";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });
gsap.registerPlugin(useGSAP);

function CircleBG() {
  return (
    <div className={styles.bgCircles}>
      <div className="circle1"></div>
      <div className="circle2"></div>
    </div>
  );
}

function LeftHeader() {
  return (
    <header className={styles.header}>
      <h2 id="firstHeaderText">Just your average</h2>
      <div
        className={
          styles.headerTitle +
          " " +
          robotoMono.className +
          " " +
          "hoverable hov-x12"
        }
      >
        <div className={styles.inlineHeader}></div>
        <h1 id="headerText">
          Software <span style={{ fontWeight: 300 }}>Developer</span>
        </h1>
      </div>
      <h2 id="secondHeaderText">...who can&apos;t design you shit</h2>
    </header>
  );
}

function NameSVG() {
  return (
    <svg
      width="45vw"
      height="32vh"
      viewBox="0 0 836 284"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.315 33L67.3032 126.76L760.646 126.76L826.002 248.5"
        stroke="url(#paint0_linear_41_19)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M1 1L58.5641 140.76L751.906 140.76L835 283.5"
        stroke="url(#paint1_linear_41_19)"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_41_19"
          x1="26.315"
          y1="140.75"
          x2="826.002"
          y2="140.75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DD8F8F" />
          <stop offset="0.9999" stopColor="#FF5935" />
          <stop offset="1" stopColor="#30201C" />
          <stop offset="1" stopColor="#FF2E00" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_41_19"
          x1="17.5758"
          y1="158.75"
          x2="951.506"
          y2="155.386"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DD8F8F" />
          <stop offset="0.9999" stopColor="#FF5935" />
          <stop offset="1" stopColor="#30201C" />
          <stop offset="1" stopColor="#FF2E00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NameComponent() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const getVideo = (url, { arg }) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify(arg),
    }).then((res) => res.json());

  const { processStream } = useMutation("/api/getVideo", getVideo);
  const { data, error } = useSWR("/api/currentlyPlaying", fetcher, {
    refreshInterval: 5000,
  });

  const [displayPlaying, setDisplayPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const [timestamp, setTimestamp] = useState("");
  const nameComp = useRef(null);
  const titleRef = useRef(null);
  const isTitleOverflow = useIsOverflow(titleRef);

  const { contextSafe } = useGSAP();

  if (data && currentlyPlaying !== data) {
    setCurrentlyPlaying(data);
  }

  useEffect(() => {
    var interval;
    if (timestamp) {
      interval = setInterval(() => {
        let timestampArray = timestamp.split(":").map((num) => parseInt(num));
        timestampArray[1] += 1;

        let minutes = timestampArray[0];
        let seconds = timestampArray[1];

        setTimestamp(
          `${minutes}:${
            seconds > 0 ? (seconds < 10 ? "0" + seconds : seconds) : "00"
          }`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timestamp]);

  useGSAP(
    () => {
      if (displayPlaying) {
        gsap.from(`.${styles.topMusicContent}`, {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });

        gsap.from(`.${styles.btmMusicContent}`, {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });
      } else {
        gsap.from(`.${styles.topNameContent}`, {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });

        gsap.from(`.${styles.btmNameContent}`, {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });
      }
    },
    { dependencies: [displayPlaying] }
  );

  useGSAP(
    () => {
      if (displayPlaying) {
        const name = gsap.utils.toArray(`.${styles.songName}`);


        // const loop = horizontalLoop(name, { repeat: -1, speed: 1});
      }
    },
    { dependencies: [displayPlaying, currentlyPlaying] }
  );

  useEffect(() => {
    var timeout;
    if (currentlyPlaying) {
      setTimestamp(currentlyPlaying.timestamp);

      if (currentlyPlaying.isPlaying && !displayPlaying) {
        timeout = gsap.delayedCall(
          3,
          contextSafe(() => {
            gsap.to(`.${styles.topNameContent}`, {
              x: -100,
              opacity: 0,
              duration: 1,
              ease: "expo.out",
            });

            gsap.to(`.${styles.btmNameContent}`, {
              x: 100,
              opacity: 0,
              duration: 1,
              ease: "expo.out",
              onComplete: () => setDisplayPlaying(true),
            });
          })
        );
      } else if (!currentlyPlaying.isPlaying) {
        contextSafe(() => {
          gsap.to(`.${styles.topMusicContent}`, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
          });

          gsap.to(`.${styles.btmMusicContent}`, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            onComplete: () => setDisplayPlaying(false),
          });
        })();
      }
    }

    return () => {
      // gsap.kill(timeout);
    };
  }, [currentlyPlaying, displayPlaying]);

  useGSAP(
    () => {
      // gsap.from(`.${styles.topBottomContent}`, {
      //   x:
      // })
    },
    { dependencies: [displayPlaying], scope: nameComp }
  );

  const mouseEnter = () => {
    if (displayPlaying != false) {
      contextSafe(() => {
        gsap.to(`.${styles.topMusicContent}`, {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });

        gsap.to(`.${styles.btmMusicContent}`, {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          onComplete: () => {
            setDisplayPlaying(false);
            setCurrentlyPlaying(null);
          },
        });
      })();
    }
  };

  const mouseLeave = () => {
    contextSafe(() => {
      gsap.to(`.${styles.topNameContent}`, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      });

      gsap.to(`.${styles.btmNameContent}`, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        onComplete: () => {
          setDisplayPlaying(true);
        },
      });
    });
  };

  return (
    <header ref={nameComp} className={styles.name}>
      <div className={styles.nameContainer}>
        <NameSVG />

        {!displayPlaying && (
          <div className={styles.topBottomContent}>
            <div className={styles.topNameContent}>
              <h1>REHAN</h1>
            </div>

            <div className={styles.btmNameContent}>
              <h1>ALI</h1>
            </div>
          </div>
        )}

        {displayPlaying && (
          <div className={styles.topBottomMusic}>
            <div className={styles.topMusicContent}>
              <div className={styles.songChip}>
                <Image
                  src={currentlyPlaying.albumCover}
                  width={104}
                  height={104}
                  className={styles.albumCover + " " + "hoverable hover-x2"}
                  alt="Album cover"
                />
                <div className={styles.songDetails}>
                  <div className={styles.outer}>
                    <span ref={titleRef} className={styles.songName}>
                      {currentlyPlaying.name}
                    </span>
                  </div>
                  <span className={styles.songArtists}>
                    {currentlyPlaying.artists[0]}
                  </span>
                </div>
              </div>
              <p className={styles.songDuration}>
                {timestamp} / {currentlyPlaying.duration}
              </p>
            </div>

            <div className={styles.btmMusicContent}>
              <h1 onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
                currently playing
              </h1>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className={styles.everything}>
      <CircleBG />
      <div className={styles.mainContent}>
        <LeftHeader />
        <NameComponent />
      </div>
    </div>
  );
}
