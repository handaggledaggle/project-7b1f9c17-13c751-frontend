import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "printtie",
  description: "작가 진입장벽은 낮추고, 인쇄·배송은 대신합니다",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{props.children}</body>
    </html>
  );
}
