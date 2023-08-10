
import Header from "@/components/Header";

export const metadata = {
  title: "Instituto Anima",
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
