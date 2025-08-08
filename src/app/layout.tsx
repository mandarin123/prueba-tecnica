import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Store",
  description: "Find the best product combinations within your budget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
