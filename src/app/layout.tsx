import "./globals.css";
import Providers from "../components/Providers";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "Pesquisa Educação",
  description: "Formulário de Pesquisa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-800">
      <body>
        <Providers>
          {/* <Header /> */}

            {children}

        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
