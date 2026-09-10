import type { Metadata } from "next";
import "./compiled.css";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/providers/SmoothScroll";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#F6F6F8] text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <SmoothScroll>
          <CartProvider>{children}</CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
