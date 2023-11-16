import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";

export const metadata = {
  title: "Pesquisa Educação",
  description: "Formulário de Pesquisa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-800">
      <body>
        <NextAuthSessionProvider>
            {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
