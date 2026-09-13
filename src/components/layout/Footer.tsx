"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/audio";
import { ArrowRight, Check, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    soundManager.playClick();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer
      lang="fa"
      className="relative w-full bg-[#111113] dark:bg-[#070709] text-neutral-400 py-20 md:py-28 px-8 md:px-16 border-t border-neutral-800 dark:border-white/[0.08] font-sans text-left"
      style={{ letterSpacing: "normal" }}
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Top Tier: Wordmark & Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-16 border-b border-neutral-800 dark:border-white/[0.08] gap-12">
          <div>
            <span className="text-2xl md:text-3xl font-bold tracking-[0.35em] text-white uppercase block mb-3 font-mono">
              PORSCHE IRAN
            </span>
            <span
              className="text-xs text-neutral-500 dark:text-neutral-400 block font-sans"
              style={{ letterSpacing: "normal" }}
            >
              بوتیک تخصصی قطعات، فیس‌لیفت و اکسسوری‌های اورجینال پورشه
            </span>
          </div>

          {/* Newsletter Form */}
          <div className="w-full max-w-md">
            <span
              className="text-[10px] font-semibold text-neutral-400 block mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              خبرنامه اختصاصی پورشه ایران
            </span>
            <p
              className="text-xs text-neutral-500 dark:text-neutral-400 font-light mb-4 leading-relaxed font-sans"
              style={{ letterSpacing: "normal" }}
            >
              دریافت دعوت‌نامه‌های اختصاصی برای محصولات خاص، قطعات کمیاب و رویدادهای کلاب پورشه ایران.
            </p>

            {subscribed ? (
              <div
                className="flex items-center gap-2 text-xs text-white py-3 font-sans"
                style={{ letterSpacing: "normal" }}
              >
                <Check className="w-4 h-4 text-[#D5001C]" />
                <span>عضویت شما در خبرنامه اختصاصی با موفقیت ثبت شد.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex border-b border-neutral-700 dark:border-neutral-700 focus-within:border-white transition-colors"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد نمایید..."
                  required
                  className="w-full bg-transparent py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none font-sans"
                  style={{ letterSpacing: "normal" }}
                />
                <button
                  type="submit"
                  aria-label="عضویت در خبرنامه"
                  className="px-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Tier: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-neutral-800 dark:border-white/[0.08] text-xs">
          {/* Column 1: مدل‌های خودرو */}
          <div>
            <h5
              className="text-xs font-semibold text-white mb-4 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              مدل‌های خودرو
            </h5>
            <ul className="space-y-2.5 font-light font-sans">
              <li><a href="#boutique-store" className="hover:text-white transition-colors">ماکان (Macan)</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">کیمن (Cayman)</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">کاین (Cayenne)</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">باکستر (Boxster)</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">۹۱۱ (Carrera)</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">پانامرا (Panamera)</a></li>
            </ul>
          </div>

          {/* Column 2: دسته‌بندی‌ها */}
          <div>
            <h5
              className="text-xs font-semibold text-white mb-4 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              دسته‌بندی‌ها
            </h5>
            <ul className="space-y-2.5 font-light font-sans">
              <li><a href="#boutique-store" className="hover:text-white transition-colors">اکسسوری‌های اورجینال</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">پکیج‌های فیس‌لیفت</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">لوازم یدکی و مصرفی</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">ساعت‌ها و کرنوگراف پورشه</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">روف باکس و باربند</a></li>
            </ul>
          </div>

          {/* Column 3: خدمات مشتریان */}
          <div>
            <h5
              className="text-xs font-semibold text-white mb-4 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              خدمات مشتریان
            </h5>
            <ul className="space-y-2.5 font-light font-sans">
              <li><a href="#" className="hover:text-white transition-colors">کانسیرژ و مشاوره تخصصی پورشه</a></li>
              <li><a href="#" className="hover:text-white transition-colors">مراکز نصب و تجهیز قطعات Tequipment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">خدمات ویژه و تحویل اختصاصی</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ضمانت اصالت ۱۰۰٪ قطعات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">سفارش قطعات نایاب از آلمان</a></li>
            </ul>
          </div>

          {/* Column 4: اطلاعات مجموعه */}
          <div>
            <h5
              className="text-xs font-semibold text-white mb-4 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              اطلاعات مجموعه
            </h5>
            <ul className="space-y-3 font-light text-neutral-300 font-sans">
              {/* Address */}
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-500 mt-1" />
                <span className="leading-relaxed">
                  آدرس: شهرک غرب گل افشان جنوبی مرکز خرید گل افشان واحد ۳ پورشه ایران
                </span>
              </li>

              {/* Phone */}
              <li>
                <a
                  href="tel:09125858446"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                  <span>
                    شماره تماس : <span className="font-mono">09125858446</span>
                  </span>
                </a>
              </li>

              {/* WhatsApp */}
              <li>
                <a
                  href="https://wa.me/09129725310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300 transition-colors fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>
                    واتس اپ : <span className="font-mono">09129725310</span>
                  </span>
                </a>
              </li>

              {/* Instagram Club */}
              <li>
                <a
                  href="https://www.instagram.com/porscheclubirann/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>
                    پیج باشگاه پورشه ایران : <span className="font-mono">porscheclubirann</span>
                  </span>
                </a>
              </li>

              {/* Instagram Products */}
              <li>
                <a
                  href="https://www.instagram.com/porsche.iran/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>
                    پیج محصولات : <span className="font-mono">porsche.iran</span>
                  </span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:info@porscheir.com"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                  <span>
                    ایمیل : <span className="font-mono">info@porscheir.com</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Legal & Copyright */}
        <div
          className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-neutral-500 font-sans"
          style={{ letterSpacing: "normal" }}
        >
          <div>
            © {new Date().getFullYear()} پورشه ایران (Porsche Iran). تمامی حقوق محفوظ است.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">حریم خصوصی</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">شرایط فروش و خدمات</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">تنظیمات کوکی</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">قوانین و مقررات</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
