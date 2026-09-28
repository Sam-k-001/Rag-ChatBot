import "./global.css";

export const metadata = {
  title: "F1 RAG ChatBot",
  description: "Formula 1 RAG Chatbot built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}