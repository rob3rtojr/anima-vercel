import SelectForm from "@/components/SelectForm";

export const metadata = {
    title: "Pesquisa Educação - Meus Formulários",
    description: "Formulário",
  };

export default function ListaFormularios() {
    return (
        <>
        <div className={"flex flex-row justify-center items-center h-[calc(100vh-300px)] md:h-screen bg-slate-800 gap-1"}>
             <SelectForm /> 
        </div>

        </>
    )
}