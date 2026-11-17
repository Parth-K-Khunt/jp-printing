import type { Metadata, Viewport } from "next";
import ClientSafeDOM from "@/components/layout/ClientSafeDOM";
import "./globals.css";
import "./scrollbar.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F6F2",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jp-printing-3ei.pages.dev"),
  title: {
    default: "JP Printing & Signs | Commercial Printing & Architectural Signage | Ontario, Canada",
    template: "%s | JP Printing & Signs",
  },
  description:
    "Premier commercial printing and custom architectural signage in Ontario, Canada. Specializing in business cards, storefront signs, vehicle wraps, window graphics, banners, and large-format printing.",
  icons: {
    icon: "/image/logo/jp_logo.webp",
    apple: "/image/logo/jp_logo.webp",
  },
  openGraph: {
    title: "JP Printing & Signs | Commercial Printing & Architectural Signage",
    description:
      "High-quality commercial printing and architectural signage solutions that help Canadian businesses stand out.",
    url: "https://jp-printing-3ei.pages.dev",
    siteName: "JP Printing & Signs",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/image/hero/jp-modern-storefront.webp",
        width: 1605,
        height: 980,
        alt: "JP Printing & Signs Commercial Storefront and Facility",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && typeof Node !== 'undefined' && Node.prototype) {
                  var origRemoveChild = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    if (!child || child.parentNode !== this) {
                      return child;
                    }
                    return origRemoveChild.apply(this, arguments);
                  };
                  var origInsertBefore = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, refNode) {
                    if (refNode && refNode.parentNode !== this) {
                      return newNode;
                    }
                    return origInsertBefore.apply(this, arguments);
                  };
                  window.addEventListener('error', function(e) {
                    if (e && e.message && (e.message.indexOf('removeChild') !== -1 || e.message.indexOf('not a child') !== -1)) {
                      e.preventDefault();
                      e.stopImmediatePropagation();
                    }
                  }, true);
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientSafeDOM />
        <div id="__app_root" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
