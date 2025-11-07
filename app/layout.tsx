import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

// Configuramos las fuentes para que Next.js las optimice
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Abraham Ordoñez | Portafolio de Ingeniería",
  description: "Portafolio de Abraham Ordoñez, Ingeniero de Sistemas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* El body ahora es gris claro, y el color oscuro se aplica a un DIV interno */}
      <body className={`font-inter antialiased ${inter.variable} ${notoSans.variable} bg-gray-50 dark`}>
        {/* Este div aplica el fondo oscuro y define la estructura principal */}
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] group/design-root overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}