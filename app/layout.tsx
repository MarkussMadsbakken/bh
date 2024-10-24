import type { Metadata } from "next";
import { Open_Sans } from 'next/font/google'
import "./globals.css";
import LayoutWrapper from "@/components/layoutwrapper";
import Topbar from "@/components/topbar";
import PageEnter from "@/components/pageenter";

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
        className={`${open.className} bg-[#fcbd20]`}
      >
        <LayoutWrapper>
          <PageEnter>
            {children}
          </PageEnter>
        </LayoutWrapper>
      </body>
    </html>
  );
}
