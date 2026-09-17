import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🛠️ 카카오톡/문자 링크 공유 시 보이는 정보 설정
export const metadata: Metadata = {
  title: "상은이 2026 생일 펀딩 🎂",
  description: "상은이의 대학 생활 마지막 스키 합숙을 위한 생일 펀딩! 많은 후원 부탁드립니다 🙇‍♂️",
  openGraph: {
    title: "조상은 2026 생일 펀딩 🎂",
    description: "상은이의 23살 생일을 맞아 생일 펀딩을 오픈했습니다!",
    images: [
      {
        url: "/winner.jpg", // 👈 winner.jpg로 설정 완료!
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
