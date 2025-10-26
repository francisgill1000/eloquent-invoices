import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "EI",
  description: "Eloquent Invoice",
  manifest: "/manifest.json",
  icons: {
    icon: "/manifest-icons/favicon.ico",
    apple: "/manifest-icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/manifest-icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          href="/manifest-icons/apple-touch-icon.png"
        />
        <meta name="theme-color" content="#37053e" />
        <meta name="msapplication-TileColor" content="#37053e" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#37053e" />
      </head>
      <body>
        <div className="relative flex min-h-screen overflow-x-hidden bg-gray-50 dark:bg-slate-900">
          {/* Sidebar (visible on md and above) */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1 justify-between">
            <Header />
            <main className="flex-1 pb-20">{children}</main>

            {/* Footer only on mobile */}
            <div className="block md:hidden">
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
