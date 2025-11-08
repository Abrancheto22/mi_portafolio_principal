import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata = {
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
      {/* --- ESTA ES LA LÍNEA CLAVE --- */}
      {/* El body debe tener 'bg-slate-50' (blanco hueso) 
        y 'text-slate-900' (texto oscuro).
      */}
      <body
        className={`font-inter antialiased ${inter.variable} ${notoSans.variable} bg-slate-50 text-slate-900`}
      >
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
          {children}
        </div>
      </body>
    </html>
  );
}