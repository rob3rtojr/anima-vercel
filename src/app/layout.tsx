import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import Analytics from "@/components/Analyticts/page";
import { inter } from "@/app/styles/fonts"; 

export const metadata = {
  title: "Pesquisa Educação - Autenticação",
  description: "Formulário de Pesquisa",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-800">
      <body className={inter.className}>
        <NextAuthSessionProvider>
            {children}
        </NextAuthSessionProvider>
        <Analytics/>
      </body>
    </html>
  );
}
