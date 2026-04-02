"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "shadow-lg" : ""
        )}
        style={{ backgroundColor: "#2F3192" }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo — large, prominent */}
          <Link href="/" className="flex items-center group shrink-0">
            <Logo
              size={160}
              className="group-hover:scale-[1.03] transition-transform duration-300"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg",
                  pathname === link.href
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-secondary-400 rounded-full"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* ANDF LIVE — integrated, not garish */}
            <Link href="/live">
              <div className="flex items-center gap-2.5 px-5 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <div className="absolute h-2 w-2 rounded-full bg-red-400/60 animate-ping" />
                </div>
                <span className="text-white font-semibold text-[13px] tracking-wider uppercase">
                  ANDF Live
                </span>
              </div>
            </Link>

            {/* Donate — warm orange, inviting */}
            <Link href="/donate">
              <Button
                variant="donate"
                size="sm"
              >
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 z-50 p-6 flex flex-col"
              style={{ backgroundColor: "#2F3192" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-8">
                <Logo size={120} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/70 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block py-3 px-4 text-lg font-medium rounded-lg transition-colors",
                        pathname === link.href
                          ? "text-white bg-white/15"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Link href="/live">
                  <div className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="relative flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-400/60 animate-ping" />
                    </div>
                    <span className="text-white font-semibold text-[13px] tracking-wider uppercase">
                      ANDF Live
                    </span>
                  </div>
                </Link>
                <Link href="/donate">
                  <Button variant="donate" className="w-full">
                    <Heart className="h-4 w-4" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
