import type { Metadata } from "next";
import { Open_Sans } from 'next/font/google'
import "./globals.css";
import LayoutWrapper from "@/components/layoutwrapper";
import Sidebar from "@/components/topbar";
import Topbar from "@/components/topbar";

const open = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Tihlde BH",
  description: "Tihlde BH sin tilstedeværelse på det verdensomspennende nettet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${open.className}`}
      >
        <LayoutWrapper>
          <Topbar />
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
