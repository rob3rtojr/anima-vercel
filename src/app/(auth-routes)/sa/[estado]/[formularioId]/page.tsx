import FormularioSA from '@/components/formulariov2/formularioSA';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Pesquisa Educação - Formulário'
};

export default function FormularioPage({ params }: { params: { estado:string, formularioId: string } }) {
    
    console.log(params.estado)
    console.log(params.formularioId)

    return (
        <div className='h-[full] flex flex-col bg-slate-800'>          
            <FormularioSA params={params} />
        </div>
    )

}