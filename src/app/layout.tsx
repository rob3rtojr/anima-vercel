import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import Analytics from "@/components/Analyticts/page";

export const metadata = {
  title: "Pesquisa Educação - Autenticação",
  description: "Formulário de Pesquisa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-800">
      <body>
        <NextAuthSessionProvider>
            {children}
        </NextAuthSessionProvider>
        <Analytics/>
      </body>
    </html>
  );
}
