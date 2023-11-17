"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'
import { useEffect, useState } from "react";
import LoadImage from "./elements/LoadImage";
import DefaultModal from "./DefaultModal";
import { api } from "@/lib/api"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Formulario = {
    id: number,
    nome: string,
    tipo: string,
    duracao: string
}
type FormularioUsuario = {
    isLoading: boolean,
    situacao: number,
    formulario: Formulario
}

export default function SelectForm() {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false)
    const [formularios, setFormularios] = useState<FormularioUsuario[]>([])
    const [formularioAtivo, setFormularioAtivo] = useState<number>()
    const [duracao, setDuracao] = useState<string>("")
    const { data: session } = useSession();



    const fetchOptions = async () => {

        try {
            setIsLoading(true)
            setIsError(false)
            const response = await api.get(`/${session?.user.role === "aluno" ? "listaFormulariosAluno" : "listaFormulariosProfessor"}/${session?.user.id}`, {
                headers: {
                    'Authorization': `Bearer ${session?.user.accessToken}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            })
            setFormularios(response.data)
            setIsError(false)
            setIsLoading(false)
        } catch (err) {
            toast.error("Ocorreu um erro!")
            setIsError(true)
            setIsLoading(false)

        }
    }


    useEffect(() => {

        if (session?.user.accessToken)
            fetchOptions()

    }, [session?.user])

    function handleClickForm(id: number, situacao: number, tempoDuracao: string) {

        setFormularioAtivo(id);

        setDuracao(tempoDuracao)
        console.log(tempoDuracao)

        if (situacao === 1 || situacao === 4) {
            setIsModalOpen(true);
        }
        else if (situacao === 3) {
            toast.success("Você já preencheu o formulário. Obrigado!")

        } else {
            handleOpenFormulario(id)
        }
    }

    function handleStartForm() {
        const resp = api.put("/situacaoFormulario", {
            tipo: session?.user.role,
            formularioId: formularioAtivo,
            pessoaId: session?.user.id,
            situacao: 2
        }, {
            headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
        }).then(resp => {

            let form = [...formularios]
            let index = form.findIndex((f) => { f.formulario.id === formularioAtivo })
            if (index >= 0) {
                form[index].situacao = 2
                setFormularios(form)
            }
            router.push(`/user/formulario/${formularioAtivo}`)
        }).catch(error => toast.error(`Ocorreu um erro ao selecionar o formulário. Tente novamente.`))
    }

    function handleUnauthorizedForm() {

        let form = [...formularios]
        let index = -1
        form.map((f, i) => {
            if (f.formulario.id === formularioAtivo) {
                index = i
                return;
            }

        })

        form[index].isLoading = true
        setFormularios(form)

        const fetchOptions = async () => {
            try {

                const resp = api.put("/situacaoFormulario", {
                    tipo: session?.user.role,
                    formularioId: formularioAtivo,
                    pessoaId: session?.user.id,
                    situacao: 4
                }, {
                    headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
                }).then(resp => {

                    if (index >= 0) {
                        let form = [...formularios]
                        form[index].situacao = 4
                        form[index].isLoading = false
                        setFormularios(form)
                        //setIsLoading(false)
                    }
                }).catch(error => toast.error(`Ocorreu um erro. Tente novamente.`))

            } catch (err) {
                toast.error(`Ocorreu um erro!`)
            }
        }

        fetchOptions()

    }

    function handleOpenFormulario(id: number) {

        if (!isLoading) {
            let form = [...formularios]
            let index = form.findIndex((f) => f.formulario.id === id)
            if (index >= 0) {
                form[index].isLoading = false
                setFormularios(form)
                //setIsLoading(false)
            }
            router.push(`/user/formulario/${id}`)
        }
    }

    function getAndamento(andamentoId: number) {
        let descAndamento = ""
        switch (andamentoId) {
            case 1:
                descAndamento = "Não iniciado"
                break;
            case 2:
                descAndamento = "Em andamento"
                break
            case 3:
                descAndamento = "Finalizado"
                break
            case 4:
                descAndamento = "Preenchimento Recusado"
                break
            default:
                break;
        }

        return descAndamento
    }

    function handleAccept(accept: boolean) {
        if (accept) {
            setIsLoadingModal(true)
            handleStartForm()

        } else {
            setIsModalOpen(false);
            handleUnauthorizedForm()
        }
    }

    if (session && session.user) {
        return (
            <>
                <div className="flex flex-col">
                    <div className="text-white top-0 ml-4 mr-4 mb-4 pb-2">
                        <p className="text-white text-2xl pr-2">{`Olá, ${session.user.nome}`}</p>
                        <p>Selecione um formulário abaixo: </p>
                    </div>

                    <div className="flex md:flex-row flex-col just">
                        {formularios.length > 0 &&
                            formularios.map((f, index) => {


                                return (<button key={index} onClick={() => handleClickForm(f.formulario.id, f.situacao, f.formulario.duracao)}>
                                    <div className="flex flex-col rounded-md shadow-sm md:w-96 min-w-96  h-32 bg-violet-500 p-4 hover:bg-violet-700 text-white transition-all m-4 justify-center items-center">
                                        <div className="text-2xl flex flex-row justify-center items-center gap-2">
                                            {!formularios[index].isLoading && <Edit />}
                                            {formularios[index].isLoading && <LoadImage />}


                                            {f.formulario.nome}
                                        </div>
                                        <div>{`${getAndamento(f.situacao)}`}</div>
                                    </div>
                                </button>
                                )
                            })
                        }
                        {
                            isLoading && <div className="flex flex-row justify-center items-center w-full text-yellow-400"><LoadImage /></div>
                        }
                        {
                            formularios.length === 0 && !isError && !isLoading && <div className="flex flex-row justify-center items-center w-full text-yellow-400">Nenhum registro encontrado!</div>
                        }
                        {
                            formularios.length === 0 && isError && 
                                <div className="flex flex-col gap-4 w-full justify-center items-center">
                                    <span className="text-red-600" >Ocorreu um erro!</span>
                                    <button onClick={fetchOptions} className="transition-colors ml-2 p-2 mr-2 border border-violet-700 text-violet-400 hover:text-violet-400 rounded hover:bg-slate-900">Recarregar Página</button>

                                </div>
                        }

                    </div>
                    <DefaultModal
                        handleAccept={handleAccept}
                        setIsModalOpen={setIsModalOpen}
                        isModalOpen={isModalOpen}
                        isLoading={isLoadingModal}
                        estadoLogado={session.user.siglaEstado}
                        nome={session.user.nome}
                        tipo={session.user.role}
                        duracao={duracao}
                    />

                </div>
                <ToastContainer />
            </>

        );
    }
    return (
        <></>
    );
}