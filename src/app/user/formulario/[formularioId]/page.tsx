
import Formulario from "@/components/formulario/Formulario"


export default function FormularioPage({ params }: { params: { formularioId: string } }) {

    return (
        <div className='h-[full] flex flex-col bg-slate-800'>          
            <Formulario params={params} />
        </div>
    )

}