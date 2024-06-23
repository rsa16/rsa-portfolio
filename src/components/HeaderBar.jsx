"use client";

import styles from "./HeaderBar.module.css";
import useSWR from "swr";

function Title(props) {
  return (
    <div className={styles.navTitle}>
      <div className={styles.titleBorder}></div>
      <p>{props.name}</p>
      <div className={styles.titleBorder}></div>
    </div>
  );
}

function StatusText() {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const baseURL = new URL("https://api.open-meteo.com/v1/forecast");

  baseURL.searchParams.append("latitude", 40.61);
  baseURL.searchParams.append("longitude", -74.22);
  baseURL.searchParams.append("current", "temperature_2m");
  baseURL.searchParams.append("temperature_unit", "fahrenheit");
  baseURL.searchParams.append("forecast_days", 1);

  const { data, error } = useSWR(baseURL.href, fetcher);

  var temp;
  if (!data || error) {
    temp = "0°";
  } else {
    temp = Math.round(data.current.temperature_2m) + "°";
  }

  const timeOptions = {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
  };

  const time = new Date().toLocaleTimeString("en-US", timeOptions);

  return (
    <div className="hoverable" id={styles.statusText}>
      <p>
        It&apos;s <span style={{ fontWeight: 700 }}>{temp} F</span> in NJ
      </p>
      <p>
        <span style={{ fontWeight: 700 }}>{time}</span> if you&apos;re trying to
        reach me
      </p>
    </div>
  );
}

export default function HeaderBar() {
  return (
    <nav className={styles.navBar}>
      <h1 id={styles.headerIcon}>RSA16</h1>

      <Title name="home" />
      <StatusText />
    </nav>
  );
}
