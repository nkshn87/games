import "./globals.css";
import "@repo/ui/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@repo/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "card sugoroku",
  description: "card sugoroku",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
