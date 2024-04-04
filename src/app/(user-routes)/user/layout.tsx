
import { getServerSession } from "next-auth"
import Header from "@/components/Header";
import { nextAuthOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"


export const metadata = {
  title: "Pesquisa Educação - Selecione um Formulário",
  description: "Formulário",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const session = await getServerSession(nextAuthOptions)

  if (!session) {
      redirect('/')
  }  

  return (
    <>
      <Header />
      {children}
    </>

  );
}
