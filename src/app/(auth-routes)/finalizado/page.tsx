import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pesquisa Educação - Obrigado!'
};

export default function FormularioPage({ params }: { params: { estado: string, formularioId: string } }) {

    console.log(params.estado)
    console.log(params.formularioId)

    return (
        <div className="relative min-h-screen bg-slate-800">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
                Finalizado com sucesso!
            </div>
        </div>

    )

}