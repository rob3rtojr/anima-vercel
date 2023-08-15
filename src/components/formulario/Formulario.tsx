'use client'
import Card from "@/components/formulario/Card/page";
import PerguntaCheckbox from "@/components/formulario/PerguntaCheckbox/page";
import { useEffect, useState } from "react";
import { PerguntaType } from "../../Types/types"
import { TipoPerguntaEnum } from "../../enum/TipoPergunta"
import { api } from "@/lib/api"
import PerguntaText from "@/components/formulario/PerguntaText/page";
import Pergunta from "@/components/formulario/Pergunta/page";
import PerguntaOption from "@/components/formulario/PerguntaOption/page";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

import Loading from '../Loading';
import LoadImage from "../elements/LoadImage";
import PerguntaRange from "./PerguntaTextRange/page";


export default function Formulario({ params }: { params: { formularioId: string } }) {
    const router = useRouter()
    const { data: session } = useSession();
    const colorBg = "bg-teal-500"
    const colorBg2 = "bg-teal-750"
    const colorText = "bg-white"

    const [formulario, setFormulario] = useState<PerguntaType[]>()
    const [nomeFormulario, setNomeFormulario] = useState<string>("")
    const [contador, setContador] = useState(0)
    const [totalPergunta, setTotalPergunta] = useState(0)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isLoading, setIsLoadng] = useState<boolean>(true)
    const [isLoadingButtonFinish, setIsLoadngButtonFinish] = useState<boolean>(false)
    const [respostas, setRespostas] = useState({})
    const [faltaResponder, setFaltaResponder] = useState<string[]>([])


    // const [respostas, setRespostas] = useState<Resposta[]>([])
    // const [habilitado, setHabilitado] = useState<boolean>(true)

    useEffect(() => {

        const fetchOptions = async () => {
            try {

                const response = await api.get(`/formulario/${params.formularioId}`, {
                    headers: {
                        'Authorization': `Bearer ${session?.user.accessToken}`,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                })

                let perguntas = [...response.data]
                setFormulario(perguntas)

                const nomeForm = session?.user.formularios.find((f) => f.formulario.id === parseInt(params.formularioId))?.formulario.nome
                nomeForm ? setNomeFormulario(nomeForm) : setNomeFormulario("")

                //percorre as perguntas e adiciona campos para controle da tela
                response.data.map((d: any, index: number) => {

                    perguntas[index] = { ...perguntas[index], ...{ "isDisabled": false } }
                    if (perguntas[index].timer) {

                        perguntas[index] = {
                            ...perguntas[index], ...{
                                "porcentagemTimer": 0,
                                "isVisibleButton": true,
                                "isVisiblePergunta": false,
                                "isVisibleCampo": false,
                                "contador": 0
                            }
                        }

                        if (perguntas[index].resposta.length > 0) {
                            perguntas[index].isVisiblePergunta = false
                            perguntas[index].isVisibleButton = false
                            perguntas[index].isVisibleCampo = true
                        }
                    }
                })

                setFormulario(perguntas)
                setIsLoadng(false)

            } catch (error) {
                toast.error('Usuário não autenticado')
                console.log("-->Não autorizado:", error);
                return
            }

        }

        if (session?.user.accessToken)
            fetchOptions()

    }, [session?.user.accessToken])

    function handleResposta(perguntaId: string, valor: string) {
        setRespostas({
            ...respostas,
            [perguntaId]: valor
        })

        atualizaFaltaResponder(perguntaId)
    }

    function desmarcaItensDependentes(formularioAtualizado: PerguntaType[], idPergunta: string, idAlternativa: string) {

        let contMarcado = 0;

        //localiza as perguntas que escutam a alternativa
        formularioAtualizado.map((f, index) => {
            f.escutar.map((e) => {

                if (e.escutarPerguntaId.toString() === idPergunta.toString() && e.escutarAlternativaId.toString() === idAlternativa.toString()) {

                    //verifica se alguma alternativa que está sendo escutada está marcada
                    formularioAtualizado[index].escutar.map((a) => {

                        const perguntaIndex = formularioAtualizado.findIndex((pergunta) => pergunta.id.toString() === a.escutarPerguntaId.toString());
                        const alternativaIndex = formularioAtualizado[perguntaIndex].alternativa.findIndex((alternativa) => alternativa.id.toString() === a.escutarAlternativaId.toString());

                        if (formularioAtualizado[perguntaIndex].alternativa[alternativaIndex].isChecked) {
                            contMarcado++
                        }
                    })

                    if (contMarcado <= 1) {
                        formularioAtualizado[index].resposta = []
                        for (let i = 0; i < formularioAtualizado[index].alternativa.length; i++) {
                            //desmarca os itens
                            formularioAtualizado[index].alternativa[i].isChecked = false
                        }
                    }

                }
            })
        })
    }

    function handleInputText(idPergunta: string, value: string) {
        const perguntaIndex = formulario ? formulario?.findIndex((pergunta) => pergunta.id === idPergunta) : -1;
        if (perguntaIndex !== -1 && formulario) {
            const formularioAtualizado = [...formulario]; // Faz uma cópia do estado atual

            formularioAtualizado[perguntaIndex].resposta.length === 0 ?
                formularioAtualizado[perguntaIndex].resposta.push(value) :
                formularioAtualizado[perguntaIndex].resposta[0] = value

            setFormulario(formularioAtualizado);
        }
    }

    function handleInputTextBlur(idPergunta: string, value: string) {
        const perguntaIndex = formulario ? formulario.findIndex((pergunta) => pergunta.id === idPergunta) : -1;
        let acao: string = ""
        let mensagem: string = ""
        if (perguntaIndex !== -1 && formulario) {
            const formularioAtualizado = [...formulario]; // Faz uma cópia do estado atual

            if (formularioAtualizado[perguntaIndex].respostaBanco.length === 0 && value !== "") {
                acao = "I"
                mensagem = "incluída"
            } else if (formularioAtualizado[perguntaIndex].respostaBanco.length > 0 && value !== "") {
                acao = "A"
                mensagem = "alterada"
            } else if (formularioAtualizado[perguntaIndex].respostaBanco.length > 0 && value === "") {
                acao = "D"
                mensagem = "excluída"
            }

            const resp = api.post("/resposta", {
                tipo: session?.user.role,
                perguntaId: parseInt(idPergunta),
                pessoaId: session?.user.id,
                resposta: value,
                acao
            }, {
                headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
            }).then(resp => {

                toast.success(`Resposta ${mensagem} com sucesso!`)

                //acao === "E" ? formularioAtualizado[perguntaIndex].respostaBanco = new Array<string> : formularioAtualizado[perguntaIndex].respostaBanco[0] = value
                formularioAtualizado[perguntaIndex].respostaBanco = []
                formularioAtualizado[perguntaIndex].respostaBanco.push(value)

                formularioAtualizado[perguntaIndex].resposta = []
                formularioAtualizado[perguntaIndex].resposta.push(value)

                setFormulario(formularioAtualizado);
                handleResposta(idPergunta, value)

            }).catch(
                error => {
                    toast.error(`Ocorreu um erro! ${error}`)
                    formularioAtualizado[perguntaIndex].resposta = []
                    setFormulario(formularioAtualizado)
                }
            )


        }
    }

    function handleClickOption(idPergunta: string, idAlternativa: string, value: string) {

        const perguntaIndex = formulario ? formulario.findIndex((pergunta) => pergunta.id === idPergunta) : -1;
        let acao: string = ""

        if (perguntaIndex !== -1 && formulario) {
            const formularioAtualizado = [...formulario]; // Faz uma cópia do estado atual

            formularioAtualizado[perguntaIndex].resposta.length === 0 ? acao = "I" : acao = "A"

            //armazena a resposta
            const resp = api.post("/resposta", {
                tipo: session?.user.role,
                perguntaId: parseInt(idPergunta),
                pessoaId: session?.user.id,
                resposta: value,
                acao
            }, {
                headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
            }).then(resp => {

                acao === "I" ? formularioAtualizado[perguntaIndex].resposta.push(value) : formularioAtualizado[perguntaIndex].resposta[0] = value

                formularioAtualizado[perguntaIndex].alternativa.map((a) => {
                    if (a.id === idAlternativa) {
                        a.isChecked = !a.isChecked
                    } else {
                        a.isChecked = false
                        desmarcaItensDependentes(formularioAtualizado, idPergunta, a.id)
                    }
                })

                setFormulario(formularioAtualizado);
                handleResposta(idPergunta, value)
                toast.success(`Resposta ${acao === 'I' ? 'incluída' : 'alterada'} com sucesso!`)

            }).catch(
                error => toast.error(`Ocorreu um erro! ${error}`)

            )

        }

    }

    function handleClickAlternativa(idPergunta: string, idAlternativa: string, value: boolean) {

        setIsSaving(true)

        const perguntaIndex = formulario ? formulario.findIndex((pergunta) => pergunta.id === idPergunta) : -1;
        let acao: string = ""
        let mensagem: string = ""

        if (perguntaIndex !== -1 && formulario) {
            const formularioAtualizado = [...formulario]; // Faz uma cópia do estado atual

            if (!value) {
                formularioAtualizado[perguntaIndex].resposta.push(idAlternativa.toString())
            } else {
                const indexResposta = formularioAtualizado[perguntaIndex].resposta.findIndex((r) => r === idAlternativa.toString())
                formularioAtualizado[perguntaIndex].resposta.splice(indexResposta, 1)
            }

            if (formularioAtualizado[perguntaIndex].respostaBanco.length === 0) {
                acao = "I"
                mensagem = "incluída"
            } else if (formularioAtualizado[perguntaIndex].respostaBanco.length > 0 && formularioAtualizado[perguntaIndex].resposta.length > 0) {
                acao = "A"
                mensagem = "alterada"
            } else if (formularioAtualizado[perguntaIndex].respostaBanco.length > 0 && formularioAtualizado[perguntaIndex].resposta.length === 0) {
                acao = "D"
                mensagem = "excluída"
            }

            const resp = api.post("/resposta", {
                tipo: session?.user.role,
                perguntaId: parseInt(idPergunta),
                pessoaId: session?.user.id,
                resposta: formularioAtualizado[perguntaIndex].resposta.join(','),
                acao
            }, {
                headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
            }).then(resp => {
                desmarcaItensDependentes(formularioAtualizado, idPergunta, idAlternativa)
                formularioAtualizado[perguntaIndex].respostaBanco = [...formularioAtualizado[perguntaIndex].resposta]


                const alternativaIndex = formularioAtualizado[perguntaIndex].alternativa.findIndex(
                    (alternativa) => alternativa.id === idAlternativa
                );
                if (alternativaIndex !== -1) {
                    formularioAtualizado[perguntaIndex].alternativa[alternativaIndex].isChecked = !formularioAtualizado[perguntaIndex].alternativa[alternativaIndex].isChecked; //value;
                    setFormulario(formularioAtualizado); // Atualiza o estado do formulário
                }

                handleResposta(idPergunta, formularioAtualizado[perguntaIndex].resposta.join(','))
                toast.success(`Resposta ${mensagem} com sucesso!`)
                setIsSaving(false)

            }).catch(
                error => {
                    toast.error(`Ocorreu um erro! ${error}`)
                   setIsSaving(false)
                }
            )


        }
    }

    function handleTimeOut(idPergunta: string, timer: number | undefined) {

        const perguntaIndex = formulario ? formulario.findIndex((pergunta) => pergunta.id === idPergunta) : -1;
        const timerInicial = timer;

        if (timerInicial && contador < timerInicial && formulario) {

            let formularioAtualizado = [...formulario]
            formularioAtualizado[perguntaIndex].isVisibleButton = false;
            formularioAtualizado[perguntaIndex].isVisiblePergunta = true;
            formularioAtualizado[perguntaIndex].isVisibleCampo = false;
            //formularioAtualizado[perguntaIndex].porcentagemTimer = 100

            setFormulario(formularioAtualizado)

            var porcentagemID = setInterval(() => { }, 100)

            var timerId = setInterval(() => {

                let formularioAtualizado = [...formulario]
                formularioAtualizado[perguntaIndex].contador = formularioAtualizado[perguntaIndex].contador + 1
                formularioAtualizado[perguntaIndex].porcentagemTimer = (formularioAtualizado[perguntaIndex].contador) * 100 / timerInicial

                setFormulario(formularioAtualizado)

            }, 1000);

            // after 5 seconds stop
            setTimeout(() => {
                clearInterval(timerId)
                let formularioAtualizado = [...formulario]
                //formularioAtualizado[perguntaIndex].timer = 0
                formularioAtualizado[perguntaIndex].isVisiblePergunta = false;
                formularioAtualizado[perguntaIndex].isVisibleCampo = true;

                setFormulario(formularioAtualizado)

            }, (timer * 1000) + 1000);
        }

    }

    function atualizaFaltaResponder(perguntaId: string) {
        let indiceElemento = faltaResponder.indexOf(perguntaId);
        if (indiceElemento !== -1) {
            let faltaResponderAtualizado = [...faltaResponder]
            faltaResponderAtualizado.splice(indiceElemento, 1)
            setFaltaResponder(faltaResponderAtualizado)
        }
    }

    function handleValidarFormulario() {
        setIsLoadngButtonFinish(true)
        const PerguntasRespondidas: number = formulario ? formulario.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false && f.resposta.length > 0)?.length : 0
        const totalPerguntas: number = formulario ? formulario.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length : 0
        let naoRespondido: string[] = []

        if (totalPerguntas > PerguntasRespondidas) {
            //identifica as perguntas não respondidas
            formulario?.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false && f.resposta.length === 0).map((faltaResponder) => {
                naoRespondido.push(faltaResponder.id)
            })
        }
        setFaltaResponder(naoRespondido)
        if (naoRespondido.length > 0) {
            toast.error("Você ainda não finalizou o preenchimento do formulário. Verifique as perguntas em vermelho")
            setIsLoadngButtonFinish(false)
        } else {


            const resp = api.put("/situacaoFormulario", {
                tipo: session?.user.role,
                formularioId: params.formularioId,
                pessoaId: session?.user.id,
                situacao: 3
            }, {
                headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
            }).then(resp => {

                toast.success(`Finalizado com sucesso!`)
                setIsLoadngButtonFinish(false)
                router.push(`/user/listaFormularios`)


            }).catch(error => {
                toast.error(`Ocorreu um erro ao finalizar. Tente novamente.`)
                setIsLoadngButtonFinish(false)
            })

        }
    }

    return (

        <>
            {isLoading && <Loading />}
            {!isLoading &&
                <>
                    <header className="bg-slate-750 mt-20">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="font-alt text-3xl  tracking-tight text-gray-400">{nomeFormulario}</h1>
                            <p className='text-gray-400 text-sm'></p>
                        </div>
                    </header>

                    {
                        formulario && formulario.length > 0 &&
                        formulario.map((p, index) => {

                            let isDisabled: boolean | undefined = false;

                            if (p.escutar.length > 0) {
                                isDisabled = true;
                            }

                            //controla o estado (true or false) da pergunta
                            for (let i = 0; i < p.escutar.length; i++) {

                                isDisabled = !formulario.find(f => f.id === p.escutar[i].escutarPerguntaId)?.alternativa.find(a => a.id === p.escutar[i].escutarAlternativaId)?.isChecked
                                if (!isDisabled) {

                                    break;
                                }
                            }

                            //verifica se falta responder
                            let marcaFaltaResponder: boolean = false
                            for (let i = 0; i < faltaResponder.length; i++) {
                                if (faltaResponder[i] === p.id) {
                                    marcaFaltaResponder = true
                                    break
                                }
                            }

                            formulario[index].isDisabled = isDisabled

                            if (p.tipoPerguntaId === TipoPerguntaEnum.TITULO) {
                                return (
                                    <Card key={`card${p.id}`} faltaResponder={marcaFaltaResponder} >
                                        <Pergunta key={index} texto={p.descricao} />
                                    </Card>
                                )
                            }
                            else if (p.tipoPerguntaId === TipoPerguntaEnum.CHECKBOX) {
                                return (

                                    <Card key={`card${p.id}`} faltaResponder={marcaFaltaResponder}>

                                        <Pergunta key={index} isDisabled={isDisabled} texto={`${p.numero} - ${p.descricao}`} />

                                        <PerguntaCheckbox
                                            props={p}
                                            isDisabled={isDisabled}
                                            handle={handleClickAlternativa}
                                            alternativas={formulario[index].alternativa}
                                            resposta={formulario[index].resposta}
                                            isSaving={isSaving}
                                        />

                                    </Card>

                                )
                            }
                            else if (p.tipoPerguntaId === TipoPerguntaEnum.RADIO) {
                                return (
                                    <Card key={`card${p.id}`} faltaResponder={marcaFaltaResponder}>
                                        <Pergunta key={index} isDisabled={isDisabled} texto={`${p.numero} - ${p.descricao}`} />

                                        <PerguntaOption
                                            props={p}
                                            isDisabled={isDisabled}
                                            handle={handleClickOption}
                                            alternativas={formulario[index].alternativa}
                                            resposta={formulario[index].resposta.length > 0 ? formulario[index].resposta[0] : ""}
                                        />

                                    </Card>
                                )

                            }
                            else if (p.tipoPerguntaId === TipoPerguntaEnum.TEXT) {

                                return (

                                    <Card key={`card${p.id}`} faltaResponder={marcaFaltaResponder}>
                                        <PerguntaText
                                            key={`pt${p.id}`}
                                            props={p}
                                            isDisabled={isDisabled}
                                            handleTimeOut={handleTimeOut}
                                            handleInputText={handleInputText}
                                            handleInputTextBlur={handleInputTextBlur}
                                            isVisiblePergunta={formulario.find((f) => f.id === p.id)?.isVisiblePergunta}
                                            timer={formulario.find((f) => f.id === p.id)?.timer}
                                            contador={formulario.find((f) => f.id === p.id)?.contador ? formulario.find((f) => f.id === p.id)?.contador : 0}
                                            porcentagemTimer={formulario.find((f) => f.id === p.id)?.porcentagemTimer ? formulario.find((f) => f.id === p.id)?.porcentagemTimer : 0}
                                            isVisibleButton={formulario.find((f) => f.id === p.id)?.isVisibleButton ? formulario.find((f) => f.id === p.id)?.isVisibleButton : false}
                                            isVisibleCampo={formulario.find((f) => f.id === p.id)?.isVisibleCampo ? formulario.find((f) => f.id === p.id)?.isVisibleCampo : false}
                                            inputValue={formulario.find((f) => f.id === p.id)?.resposta ? formulario.find((f) => f.id === p.id)?.resposta[0] : ""}
                                        />

                                    </Card>

                                )
                            } else if (p.tipoPerguntaId === TipoPerguntaEnum.RANGE) {
                                return (
                                    <Card key={`card${p.id}`} faltaResponder={marcaFaltaResponder}>
                                        <PerguntaRange
                                            key={`pt${p.id}`}
                                            props={p}
                                            isDisabled={isDisabled}
                                            inputValue={formulario.find((f) => f.id === p.id)?.resposta ? formulario.find((f) => f.id === p.id)?.resposta[0] : "0"}
                                            min={formulario.find((f) => f.id === p.id)?.valorMinimo ? formulario.find((f) => f.id === p.id)?.valorMinimo : 0}
                                            max={formulario.find((f) => f.id === p.id)?.valorMaximo ? formulario.find((f) => f.id === p.id)?.valorMaximo : 0}
                                            step={formulario.find((f) => f.id === p.id)?.step ? formulario.find((f) => f.id === p.id)?.step : 0}
                                            mascara={formulario.find((f) => f.id === p.id)?.mascaraResposta ? formulario.find((f) => f.id === p.id)?.mascaraResposta : ""}
                                            handleInputTextBlur={handleInputTextBlur}
                                        />

                                    </Card>
                                )
                            }

                        })

                    }

                    <Card faltaResponder={false} >
                        <Pergunta texto={"Agradecemos a sua participação! Clique no botão abaixo para enviar este formulário com os dados preenchidos."} />
                    </Card>

                    <div className='flex flex-row justify-center items-center mb-14 mt-10'>
                        <button onClick={handleValidarFormulario} className={`${colorBg} flex flex-row justify-center items-center text-white rounded-md h-10 w-40 transition duration-300 ease-in-out hover:bg-teal-700 hover:font-bold`}>
                            {isLoadingButtonFinish && <LoadImage />}
                            Finalizar
                        </button>
                    </div>
                    {formulario &&
                        <footer className={`bg-slate-600 text-gray-300 fixed bottom-0 w-full justify-center text-center`}>
                            Você respondeu {Math.round(100 * formulario.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false && f.resposta.length > 0)?.length / formulario.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length)}%
                        </footer>
                    }
                    <ToastContainer />
                </>
            }
        </>

    )

}