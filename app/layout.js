import "./globals.css";

export const metadata = {
  title: "1인 기업 맞춤형 AI 진단기",
  description: "질문에 답하고 나의 1인 기업 단계와 맞춤 코멘트를 확인합니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
