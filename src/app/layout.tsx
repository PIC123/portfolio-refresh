import "./globals.css";
import Link from "next/link";
import AsciiSparkles from "@/components/AsciiSparkles";

export const metadata = {
  title: "Phil Cherner | Portfolio",
  description: "Creative Tech Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-terminal">
        <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-black bg-opacity-80 border-b border-white z-50">
          <Link href="/" className="text-2xl font-pixel text-white">PC</Link>
          <div className="flex space-x-6 text-sm font-pixel text-white">
            {['projects', 'about', 'contact', 'resume', 'writeups'].map((link) => (
              <Link
                key={link}
                href={`/${link}`}
                className="relative group inline-block"
              >
                <span className="inline-block pb-1">
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] border-b border-dotted border-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
        <div className="pt-24 px-4 bg-black text-white font-terminal">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/3 pr-4">
              {children}
            </div>
            <div className="hidden lg:block lg:w-1/3 pl-4 fixed right-0 top-0 h-full overflow-hidden pointer-events-none">
              <AsciiSparkles />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}