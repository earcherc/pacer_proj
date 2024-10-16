import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpaceX Data Viewer",
  description: "Get insights into the latest SpaceX travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
