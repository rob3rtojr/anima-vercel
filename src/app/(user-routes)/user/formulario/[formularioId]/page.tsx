
import FormularioV2 from '@/components/formulariov2/FormularioV2';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Pesquisa Educação - Formulário'
};

export default function FormularioPage({ params }: { params: { formularioId: string } }) {

    return (
        <div className='h-[full] flex flex-col bg-slate-800'>          
            <FormularioV2 params={params} />
        </div>
    )

}