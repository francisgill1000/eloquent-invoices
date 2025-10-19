import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <link rel="apple-touch-icon" href="/manifest-icons/apple-touch-icon.png" />

        <meta name="theme-color" content="#37053e" />
        <meta name="msapplication-TileColor" content="#37053e" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#37053e" />
      </head>
      <body>
        <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
