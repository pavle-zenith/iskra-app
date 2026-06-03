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
      <body style={{ minHeight: '100vh', margin: 0 }}>{children}</body>
    </html>
  );
}
