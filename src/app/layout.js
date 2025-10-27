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
        <div className="bg-primary text-white font-sans min-h-screen flex flex-col">

          {/* 1. Header / Top Bar */}
          <Header />

          {/* 2. Main Content Wrapper */}
          <div className="flex flex-1 min-h-[calc(100vh-50px)]">

            {/* 2a. Sidebar Navigation */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* 2b. Dashboard Content (Main Area) */}
            <main className="flex-1 lg:p-8">
              {children}
            </main>
          </div>

          <div className="block md:hidden">
            <Footer />
          </div>

        </div>
      </body>
    </html>
  );
}
