import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import styles from "./styles/blinking.module.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "foo",
  description: "foobar",
};

const NAV_ITEMS: { title: string; link: string; key: number }[] = [
  { title: "Home", link: "/", key: 2 },
  { title: "Foo", link: "foobar", key: 1 },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex justify-between align-middle p-5">
          <div className={styles.typewriter}>
            <div>Browser Magician</div>
          </div>
          <div>
            {NAV_ITEMS.map((item) => (
              <Link className="m-5" href={item.link} key={item.key}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
