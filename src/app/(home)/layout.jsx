import { Montserrat } from "next/font/google";

import HeaderBar from "@/components/HeaderBar";
import Frame from "@/components/Frame";
import Cursor from "@/components/Cursor";
import PageLoader from "@/components/PageLoader";

import "./globals.css";

const montseratt = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Home - rsaaa",
  description: "Idk Bro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }} className={montseratt.className}>
        <PageLoader>
          <Cursor />
          <Frame>
            <HeaderBar />
            <div style={{ height: "calc(100% - 53px * 2)" }}>{children}</div>
          </Frame>
        </PageLoader>
      </body>
    </html>
  );
}
