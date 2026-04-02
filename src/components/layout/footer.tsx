import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { BrandDivider } from "@/components/shared/brand-divider";
import { Logo } from "@/components/ui/logo";

const quickLinks = [
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
];

const programLinks = [
  { href: "/programs/band-camp", label: "Band Camp" },
  { href: "/programs/drone-experience", label: "Drone Experience" },
  { href: "/programs/topgolf", label: "TopGolf Experience" },
  { href: "/programs/mentors", label: "MenTORS" },
  { href: "/programs/sisters-hangout", label: "Sisters Hangout" },
  { href: "/programs/mentorship", label: "Mentorship" },
  { href: "/programs/hbcu-heroes", label: "HBCU Heroes" },
];

const socials = [
  { href: "https://facebook.com", label: "Facebook", letter: "f" },
  { href: "https://youtube.com", label: "YouTube", letter: "Y" },
  { href: "https://instagram.com", label: "Instagram", letter: "I" },
];

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size={80} variant="light" />
            <p className="text-sm text-neutral-300 leading-relaxed">
              Empowering tomorrow&apos;s leaders through innovative programs, mentorship,
              and community engagement.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-neutral-700 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-secondary-400 hover:border-secondary-400/30 transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-xs font-bold">{social.letter}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400 mb-4">
              Programs
            </h4>
            <ul className="space-y-2">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-neutral-300">
                <Mail className="h-4 w-4 text-secondary-400 mt-0.5 shrink-0" />
                <a href="mailto:info@anewdayfoundation.net" className="hover:text-white transition-colors">
                  info@anewdayfoundation.net
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-300">
                <Phone className="h-4 w-4 text-secondary-400 mt-0.5 shrink-0" />
                <span>Contact us for inquiries</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-300">
                <MapPin className="h-4 w-4 text-secondary-400 mt-0.5 shrink-0" />
                <span>Los Angeles, California</span>
              </li>
            </ul>
          </div>
        </div>

        <BrandDivider className="my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} A New Day Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-secondary-500" /> for a brighter future
          </p>
        </div>
      </div>
    </footer>
  );
}
