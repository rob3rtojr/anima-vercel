
import Header from "@/components/Header";

export const metadata = {
  title: "Pesquisa Educação - Selecione um Formulário",
  description: "Formulário",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>

  );
}
