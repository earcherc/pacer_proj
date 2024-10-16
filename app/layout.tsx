import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpaceX Launch Viewer",
  description: "Explore SpaceX's launch history",
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
