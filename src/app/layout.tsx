import type { Metadata } from "next";
import localFont from "next/font/local";
import "./compiled.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SmoothScroll from "@/components/providers/SmoothScroll";
import PersianTypographyProvider from "@/components/providers/PersianTypographyProvider";

const vazirmatn = localFont({
  src: [
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-100-normal.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-200-normal.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-800-normal.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn/vazirmatn-arabic-900-normal.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Porsche — Tequipment & Accessories Boutique",
  description:
    "A cinematic, scroll-driven automotive luxury experience presenting original Porsche Tequipment, timepieces, and lifestyle accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${vazirmatn.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Syncopate:wght@400;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('porsche_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F6F6F8] dark:bg-[#0B0B0D] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 dark:selection:bg-white selection:text-white dark:selection:text-neutral-950 transition-colors duration-300">
        <PersianTypographyProvider />
        <SmoothScroll>
          <ThemeProvider>
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
