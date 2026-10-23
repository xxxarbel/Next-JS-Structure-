import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Structure",
  description: "A blank Next.js starter with a Docker Postgres database.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
