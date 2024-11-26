'use client'

import DefaultModal from '@/components/DefaultModal';
import FormularioSA from '@/components/formulariov2/formularioSA';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { MunicipioEscola } from './_components/municipio-escola';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type EstadoProps = {
    id: number;
    nome: string;
    sigla: string;
};

type EscolaSA = {
    id: number,
    inep: number,
    nome: string,
    municipioSaId: number
}


export default function FormularioPage({ params }: { params: { estado: string, formularioId: string } }) {
    const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
    const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false)
    const [tipoFormulario, setTipoFormulario] = useState<string>('')
    const [nomeFormulario, setNomeFormulario] = useState<string>('')
    const [duracao, setDuracao] = useState<string>('')
    const [accept, setAccept] = useState<boolean>(false)
    const [start, setStart] = useState<boolean>(false)
    const [selectedEscola, setSelectedEscola] = useState<string>('')
    const [selectedMunicipio, setSelectedMunicipio] = useState<string>('')
    const [estado, setEstado] = useState<EstadoProps>({ id: 0, nome: '', sigla: '' });



    function handleAccept(accept: boolean) {
        if (accept) {
            setIsLoadingModal(true)
            setAccept(true)

        } else {
            setIsModalOpen(false);
            setAccept(false)
        }
    }
    function handleSelectedMunicipio(municipio: string) {
        setSelectedMunicipio(municipio)
    }

    function handleSelectEscola(escola: string) {
        setSelectedEscola(escola)
    }

    function handleStart() {
        if (selectedEscola !== "" && selectedEscola !== "0") {
            setStart(true)
        }else {
            toast.warn("Escolha uma escola!")
        }
    }    

    useEffect(() => {
        const fetchOptions = async () => {

            try {

                const estadoAPI = await api.get(`${baseUrl}/estadosgeral/${params.estado}`)
                const { id, sigla, nome } = estadoAPI.data
                setEstado({ id, sigla, nome });    
                console.log(`Estado ${nome}`)                   

                const formularioAPI = await api.get(`${baseUrl}/tipoFormularios/${params.formularioId}`)
                const { nome: nomeForm, tipo, duracao } = formularioAPI.data
                setTipoFormulario(tipo)
                setNomeFormulario(`${nomeForm} - ${tipo}`)
                setDuracao(duracao)

                console.log('useEffect')

            }
            catch (err: any) {
                return
            }
        }

        fetchOptions()

    }, [])

    return (
        <>
            <div className='h-[full] flex flex-col bg-slate-800'>
                {!accept && !start &&
                    <div className='flex h-screen w-full justify-center items-center'>
                        <div className='w-[500px]'>
                            <MunicipioEscola estadoId={estado.id} handleSelectedMunicipio={handleSelectedMunicipio} handleSelectEscola={handleSelectEscola} handleStart={handleStart} nomeFormulario={nomeFormulario} />
                        </div>
                    </div>
                }

                {!accept && start &&
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
                    <FormularioSA params={{...params, escolaId: selectedEscola, municipioId: selectedMunicipio}} />
                }

                {!isModalOpen && !accept &&
                    <div className="flex flex-col items-center justify-center h-screen gap-2" >
                        <span className='text-white text-center text-3xl'>Que pena...</span> 
                        <span className='text-white text-sm pb-8'>agradecemos sua participação!</span>

                        {/* <Button onClick={handleRestartForm}>Reiniciar Questionário</Button> */}
                    </div>
                }
            </div>
            <ToastContainer />

        </>
    )

}