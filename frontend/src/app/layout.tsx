import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reunify - Alumni Networking",
  description: "Built for Students, By Students",
};

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
