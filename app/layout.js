import "./globals.css";

export const metadata = {
  title: "The Creators AI | 24시간 무인 비즈니스 시스템 빌더",
  description: "AI 마케팅 진단, URL 비용 누수 분석, 24시간 무인 세일즈 퍼널 및 CRM 시스템 구축",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark scroll-smooth">
      <body className="bg-[#090E17] text-slate-200 antialiased selection:bg-[#3B82F6] selection:text-white">
        {children}
      </body>
    </html>
  );
}
