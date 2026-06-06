import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Šta te stvarno drži uz cigaretu? | Iskra Quiz",
  description: "15 pitanja. Saznaj tačan profil zavisnosti, koliko trojiš godišnje i strategiju koja funkcioniše za tebe.",
  openGraph: {
    title: "Šta te stvarno drži uz cigaretu?",
    description: "Besplatni quiz. Fagerstrom skor, trošak u RSD i personalizovana strategija za prestanak.",
    siteName: "Iskra",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <head>
        <link rel="preload" href="/iskra-animated-mockup.html" as="document" />
        <link rel="preload" href="/iskra-logo.png" as="image" />
        <link rel="preload" href="/iskra-flame-ember.png" as="image" />
        <link rel="preload" href="/iskra-man.png" as="image" />
        <link rel="preload" href="/iskra-woman.png" as="image" />
        <link rel="preload" href="/canyon-bg.png" as="image" />
      </head>
      <body style={{ minHeight: '100vh', margin: 0 }}>{children}</body>
    </html>
  );
}
