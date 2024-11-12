'use client'

import DefaultModal from '@/components/DefaultModal';
import Button from '@/components/elements/Button';
import FormularioSA from '@/components/formulariov2/formularioSA';
import { api } from '@/lib/api';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

export const metadata: Metadata = {
    title: 'Pesquisa Educação - Formulário'
};

export default function FormularioPage({ params }: { params: { estado: string, formularioId: string } }) {
    const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
    const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false)
    const [tipoFormulario, setTipoFormulario] = useState<string>('')
    const [duracao, setDuracao] = useState<string>('')
    const [accept, setAccept] = useState<boolean>(false)

    function handleAccept(accept: boolean) {
        if (accept) {
            setIsLoadingModal(true)
            setAccept(true)

        } else {
            setIsModalOpen(false);
            setAccept(false)
        }
    }

    // function handleRestartForm() {
    //     setIsModalOpen(true);
    //     setAccept(false)        
    // }

    useEffect(() => {
        const fetchOptions = async () => {

            try {

                const formularioAPI = await api.get(`${baseUrl}/tipoFormularios/${params.formularioId}`)
                const { nome: nomeForm, tipo, duracao } = formularioAPI.data
                setTipoFormulario(tipo)
                setDuracao(duracao)

            }
            catch (err: any) {
                return
            }
        }
    }), []

    return (
        <>
            <div className='h-[full] flex flex-col bg-slate-800'>

                {!accept &&
                    <DefaultModal
                        handleAccept={handleAccept}
                        setIsModalOpen={setIsModalOpen}
                        isModalOpen={isModalOpen}
                        isLoading={isLoadingModal}
                        estadoLogado={params.estado}
                        nome={'Anônimo'}
                        tipo={tipoFormulario}
                        duracao={duracao}
                    />
                }
                {accept &&
                    <FormularioSA params={params} />
                }

                {!isModalOpen && !accept &&
                    <div className="flex flex-col items-center justify-center h-screen gap-2" >
                        <span className='text-white text-center text-3xl'>Que pena...</span> 
                        <span className='text-white text-sm pb-8'>agradecemos sua participação!</span>

                        {/* <Button onClick={handleRestartForm}>Reiniciar Questionário</Button> */}
                    </div>
                }
            </div>
        </>
    )

}