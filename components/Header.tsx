"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const basePath = process.env.NODE_ENV === "production" ? "/visionquest-lms" : "";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/courses", label: "Courses" },
  ];

  return (
    <header className="bg-[var(--teal-800)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
              V
            </div>
            <span className="text-xl font-bold tracking-tight">
              VisionQuest
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/" || pathname === basePath || pathname === basePath + "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--teal-600)] flex items-center justify-center text-sm font-medium">
              DH
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
