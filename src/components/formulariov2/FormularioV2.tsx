'use client'
import { api } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlternativaType, PerguntaType } from "@/Types/types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TipoPerguntaEnum } from '@/enum/TipoPergunta';
import Loading from '../Loading';
import { stat } from 'fs';
import { Card, CardBody, CardPergunta } from '../formulario/Card/page';
import Pergunta from '../formulario/Pergunta/page';
import PerguntaRangeV2 from './PerguntaTextRangeV2/page';
import { unescape } from 'querystring';
import LoadImage from '../elements/LoadImage';
import DebubArea from './DebugArea';
import Link from "next/link";



export default function FormularioV2({ params }: { params: { formularioId: string } }) {

    const router = useRouter()
    const { data: session, status } = useSession();
    const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL

    // Resposta para armazenar os respostas de todos os grupos de radio buttons

    const [respostas, setRespostas] = useState<{ [key: string]: string | null }>({});
    const [perguntas, setPerguntas] = useState<PerguntaType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFinishClick, setIsFinishClick] = useState<boolean>(false);
    const [isLoadingButtonFinish, setIsLoadngButtonFinish] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isDebugging, setIsDebugging] = useState<boolean>(false)
    const [isValidForm, setIsValidForm] = useState<boolean>(true)
    const [podePreencher, setPodePreencher] = useState<boolean>(true)
    const [nomeFormulario, setNomeFormulario] = useState<string>("")

    // // Simulação de dados obtidos da API
    // const dadosDaAPI: GrupoRadio[] = [
    //     { id: 1, nome: 'Grupo 1', opcoes: ['opcao1', 'opcao2'] },
    //     { id: 2, nome: 'Grupo 2', opcoes: ['opcao3', 'opcao4', 'opcao5'] },
    //     // Adicione mais grupos conforme necessário
    // ];

    async function logout() {
        await signOut({
            redirect: false
        })

        router.replace('/')
    }

    function handleInputText(idPergunta: string, value: string, mascaraResposta?: string) {


        const perguntaIndex = perguntas ? perguntas?.findIndex((pergunta) => pergunta.id === idPergunta) : -1;

        if (perguntaIndex !== -1 && perguntas) {
            const formularioAtualizado = [...perguntas]; // Faz uma cópia do estado atual

            if (mascaraResposta === 'number') {
                value = value.replace(/\D/g, '')
                
                formularioAtualizado[perguntaIndex].resposta.length === 0 ?
                formularioAtualizado[perguntaIndex].resposta.push(value) :
                formularioAtualizado[perguntaIndex].resposta[0] = value                

            }
            else if (mascaraResposta === 'idade') {
                if (/^\d{0,2}$/.test(value)) {
                    formularioAtualizado[perguntaIndex].resposta.length === 0 ?
                        formularioAtualizado[perguntaIndex].resposta.push(value) :
                        formularioAtualizado[perguntaIndex].resposta[0] = value
                }

            } else {
                formularioAtualizado[perguntaIndex].resposta.length === 0 ?
                    formularioAtualizado[perguntaIndex].resposta.push(value) :
                    formularioAtualizado[perguntaIndex].resposta[0] = value
            }



            setPerguntas(formularioAtualizado);
        }
    }


    // Função para atualizar o estado de um grupo de radio buttons
    const atualizarResposta = (perguntaId: string, alternativaId: string, valor: string, tipoPerguntaId: number) => {
        const idToast = toast.loading("Aguarde...")
        setIsSaving(true)


        if (tipoPerguntaId === TipoPerguntaEnum.CHECKBOX || tipoPerguntaId === TipoPerguntaEnum.RADIO) {

            const perguntasAux = [...perguntas]
            const perguntaIndex = perguntasAux ? perguntasAux.findIndex((pergunta) => pergunta.id === perguntaId) : -1;
            const alternativaIndex = perguntasAux[perguntaIndex].alternativa.findIndex(a => a.id === alternativaId)

            if (tipoPerguntaId === TipoPerguntaEnum.CHECKBOX) {
                var selecionados: string[] = []

                perguntasAux[perguntaIndex].alternativa[alternativaIndex].isChecked = !perguntasAux[perguntaIndex].alternativa[alternativaIndex].isChecked;
                perguntasAux[perguntaIndex].alternativa.map(a => {
                    if (a.isChecked)
                        selecionados.push(a.id)
                })

                valor = selecionados.join(",")

            } else {
                perguntasAux[perguntaIndex].alternativa.map(a => a.isChecked = false)
                perguntasAux[perguntaIndex].alternativa[alternativaIndex].isChecked = true

            }

            setPerguntas(perguntasAux)

        }

        setRespostas(prevRespostas => ({
            ...prevRespostas,
            [perguntaId]: valor
        }));

        const resp = api.post("/respostav2", {
            tipo: session?.user.role,
            perguntaId: perguntaId.toString(),
            pessoaId: session?.user.id.toString(),
            resposta: valor.toString()
        }, {
            headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
        }).then(resp => {

            //console.log(resp)

            if (resp.status === 200) {
                setIsSaving(false)
                toast.update(idToast, { render: `Resposta incluída com sucesso! ${resp.status}`, type: "success", isLoading: false, autoClose: 2000 })
                if (alternativaId !== "")
                    desmarcaItensDependentes(perguntaId, alternativaId, valor)

            } else {

                limparSelecao(perguntaId)

                toast.update(idToast, { render: `Ocorreu um erro! Tente novamente! ${resp.status}`, type: "error", isLoading: false, autoClose: 2000 })

                setIsSaving(false)
            }
        }).catch(
            error => {

                limparSelecao(perguntaId)

                toast.update(idToast, { render: `Ocorreu um erro de conexão com o servidor. Tente novamente!`, type: "error", isLoading: false, autoClose: 2000 })

                setIsSaving(false)
            }
        )

    };

    async function desmarcaItensDependentes(idPergunta: string, idAlternativa: string, valorResposta: string) {

        let contMarcado = 0;
        const url: any[] = []
        const perguntasDependentes: string[] = []
        var isDisabled: boolean = false
        var precisaMudar: boolean = false
        var possuiResposta: boolean = false
        var tipoPerguntaPai: number | undefined = perguntas.find(p => p.id === idPergunta)?.tipoPerguntaId
        possuiResposta = valorResposta === "" ? false : true

        //localiza as perguntas que escutam a alternativa
        perguntas.map((f, index) => {

            f.escutar.map((e) => {

                if (e.escutarPerguntaId.toString() === idPergunta.toString() && e.escutarAlternativaId.toString() === idAlternativa.toString()) {

                    // //verifica se alguma alternativa que está sendo escutada está marcada
                    // perguntas[index].escutar.map((a) => {

                    //     const perguntaIndex = perguntas.findIndex((pergunta) => pergunta.id.toString() === a.escutarPerguntaId.toString());
                    //     const alternativaIndex = perguntas[perguntaIndex].alternativa.findIndex((alternativa) => alternativa.id.toString() === a.escutarAlternativaId.toString());


                    //     if (perguntas[perguntaIndex].tipoPerguntaId === TipoPerguntaEnum.CHECKBOX && perguntas[perguntaIndex].alternativa[alternativaIndex].isChecked) {
                    //         contMarcado++
                    //         return
                    //     }
                    // })


                    perguntasDependentes.push(perguntas[index].id)

                    //if (contMarcado <= 0) {
                    if (tipoPerguntaPai === TipoPerguntaEnum.CHECKBOX) {
                        if (!possuiResposta) {

                            isDisabled = true
                            precisaMudar = true

                        } else {
                            isDisabled = false
                            precisaMudar = false

                            //HABILITA
                            if (perguntas[index].isDisabled === true) {
                                precisaMudar = true
                            }

                        }
                    }
                    else {
                        // isDisabled = true
                        // precisaMudar = true                        
                    }

                } else if (e.escutarPerguntaId.toString() === idPergunta.toString() && tipoPerguntaPai !== TipoPerguntaEnum.CHECKBOX) {
                    isDisabled = true
                    precisaMudar = true
                    perguntasDependentes.push(perguntas[index].id)
                }
            })

        })

        if (precisaMudar) {

            const perguntasAux = [...perguntas]
            perguntasDependentes.map(async pd => {

                let indexP = perguntasAux.findIndex(p => p.id === pd)

                if (indexP) {

                    //habilita ou desabilita a pergunta
                    perguntasAux[indexP].isDisabled = isDisabled

                    if (isDisabled) {

                        for (let i = 0; i < perguntasAux[indexP].alternativa.length; i++) {
                            //desmarca os itens
                            perguntasAux[indexP].alternativa[i].isChecked = false
                        }

                        //limpa a resposta
                        setRespostas(prevRespostas => ({
                            ...prevRespostas,
                            [perguntasAux[indexP].id]: ''
                        }));


                    }

                }


            })

            //grava respostas            
            const resp = await api.post("/respostav2DeleteMany", {
                tipo: session?.user.role,
                perguntaId: perguntasDependentes.join(','),
                pessoaId: session?.user.id.toString()
            }, {
                headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
            })

            setPerguntas(perguntasAux)
        }

    }

    // Função para limpar o valor selecionado em um grupo
    const limparSelecao = (perguntaId: string) => {

        setRespostas(prevRespostas => ({
            ...prevRespostas,
            [perguntaId]: ''
        }));


        let perguntasAux = [...perguntas]
        const perguntaIndex = perguntasAux ? perguntasAux.findIndex((pergunta) => pergunta.id === perguntaId) : -1;
        var selecionados: string[] = []

        perguntasAux[perguntaIndex].alternativa.map(a => {
            a.isChecked = false;
        })

        perguntasAux[perguntaIndex].resposta = []

        setPerguntas(perguntasAux)

    };

    function handleValidaFormulario() {

        setIsLoadngButtonFinish(true)
        setIsFinishClick(true)

        const faltaResponder: number = Object.keys(respostas).filter(key => respostas[key] !== "").length
        const totalPergunta: number = perguntas.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length

        if (faltaResponder !== totalPergunta) {
            toast.error("Você ainda não finalizou o preenchimento do formulário. Verifique as perguntas em vermelho.")
            setIsLoadngButtonFinish(false)
            setIsValidForm(false)
        } else {

            const idToast = toast.loading("Aguarde, Finalizando...")
            setIsValidForm(true)

            //`Ocorreu um erro de conexão com o servidor. Tente novamente!`
            const resp = api.put("/situacaoFormulario", {
                tipo: session?.user.role,
                formularioId: params.formularioId,
                pessoaId: session?.user.id,
                situacao: 3
            }, {
                headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
            }).then(resp => {

                toast.update(idToast, { render: `Finalizado com sucesso!`, type: "success", isLoading: false, autoClose: 3000 })


                setTimeout(() => {
                    router.push(`/user/listaFormularios`);
                }, 3000);


            }).catch(error => {
                toast.update(idToast, { render: `Ocorreu um erro ao finalizar. Tente novamente.`, type: "error", isLoading: false, autoClose: 3000 })
                setIsLoadngButtonFinish(false)
            })

        }

    }

    // Carregar dados da API e inicializar respostas

    useEffect(() => {

        const fetchOptions = async () => {

            try {

                const res = await fetch(`${baseUrl}/formulario/${params.formularioId}`, {
                    method: "Get",
                    headers: {
                        'Authorization': `Bearer ${session?.user.accessToken}`,
                        'Cache-Control': 'no-store',
                        'Expires': '0',
                    }
                })

                if (res.status === 401) {
                    setPodePreencher(false)
                    router.replace('/user/listaFormularios')
                }


                const response = await res.json();


                setPerguntas(response)

                const respostasIniciais: { [key: string]: string | null } = {};

                response.map((p: any) => {
                    if (p.tipoPerguntaId !== TipoPerguntaEnum.TITULO) {

                        respostasIniciais[p.id] = p.resposta[0] !== undefined ? p.resposta.join(",") : ""

                        let respostaAPI = p.resposta !== undefined ? p.resposta : []
                    }
                })

                setRespostas(respostasIniciais)

                const nomeForm = session?.user.formularios.find((f) => f.formulario.id === parseInt(params.formularioId))?.formulario.nome
                nomeForm ? setNomeFormulario(nomeForm) : setNomeFormulario("")
                setIsLoading(false)

            }
            catch (err: any) {

                toast.error(`Ocorreu um erro. Tente novamente. Erro: ${err.message}`)
                return
            }
        }

        if (status === 'authenticated') {

            // Obtém a data atual
            const dataAtual = new Date();

            // Define a data limite
            const dataLimite = new Date(`${process.env.NEXT_PUBLIC_LIMIT_DATE}`);

            // Compara as datas
            if (dataAtual < dataLimite) {
                fetchOptions()
            } else {
                toast.warning("Período para preenchimento encerrado.")
            }
        }

        if (status === 'unauthenticated') {
            logout()
        }

    }, [status])

    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && podePreencher &&
                <>
                    <div className='flex flex-col'>

                        <header className="bg-slate-750 mt-20">
                            <div className="flex flex-col justify-center gap-1 items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {/*<h1 className="font-alt text-4xl tracking-tight text-gray-200">{nomeFormulario}</h1>
                                 <p className='text-gray-400 text-sm'>Questionário de {nomeFormulario} para {session?.user.role === 'professor' ? 'servidores' : 'alunos'}</p> */}
                                <h1 className="font-alt text-4xl tracking-tight text-gray-200">Questionário</h1>
                                <p className='text-gray-400 text-sm'>“Sua colaboração neste questionário é essencial para aprofundarmos nossa compreensão
                                    sobre o perfil de gestores pedagógicos (coordenadores, gestores, assessores, coordenadores
                                    de área, etc). Por gentileza, responda às seguintes perguntas com base em suas experiências
                                    e na sua situação atual.”</p>
                            </div>
                        </header>

                        <div className="flex flex-col just">
                            {
                                perguntas.map((pergunta, index) => {


                                    let isDisabled: boolean | undefined = false;
                                    let marcaFaltaResponder: boolean = false

                                    marcaFaltaResponder = !pergunta.isDisabled && isFinishClick && respostas[pergunta.id] === '' ? true : false

                                    if (pergunta.escutar.length > 0) {
                                        isDisabled = true;
                                    }

                                    for (let i = 0; i < pergunta.escutar.length; i++) {

                                        isDisabled = !perguntas.find(f => f.id === pergunta.escutar[i].escutarPerguntaId)?.alternativa.find(a => a.id === pergunta.escutar[i].escutarAlternativaId)?.isChecked
                                        if (!isDisabled) {

                                            break;
                                        }
                                    }

                                    pergunta.isDisabled = isDisabled

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.TITULO) {
                                        return (
                                            <CardPergunta id={`C-${pergunta.id}`} className={"text-white bg-gray-800"} key={pergunta.id} faltaResponder={false} >
                                                <Pergunta className={"text-gray-400 text-xl md:text-2xl"} key={index} texto={pergunta.descricao} />
                                            </CardPergunta>
                                        )
                                    }

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.RADIO) {
                                        return (
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.numero} - ${pergunta.descricao}`} />
                                                    <CardBody>
                                                        {pergunta.alternativa.map(alternativa => (

                                                            <div key={alternativa.id} className={`flex p-1 rounded-md justify-start items-center ${pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'} `}>
                                                                <input
                                                                    id={alternativa.id}
                                                                    type="radio"
                                                                    name={pergunta.id}
                                                                    value={alternativa.id}
                                                                    checked={respostas[pergunta.id]?.toString() === alternativa.id.toString()}
                                                                    onChange={() => atualizarResposta(pergunta.id, alternativa.id, alternativa.id, pergunta.tipoPerguntaId)}
                                                                    disabled={pergunta.isDisabled || isSaving}
                                                                />
                                                                <label className={`pl-2`} htmlFor={alternativa.id}>{alternativa.descricao}</label>
                                                            </div>
                                                        ))}

                                                        {isDebugging && <DebubArea pergunta={pergunta} resposta={respostas[pergunta.id]} limpar={limparSelecao} />}

                                                    </CardBody>
                                                </div>
                                            </Card>
                                        )
                                    }


                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.CHECKBOX) {
                                        return (
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.numero} - ${pergunta.descricao}`} />
                                                    <CardBody>
                                                        {pergunta.alternativa.map(alternativa => (

                                                            <div key={alternativa.id} className={`flex p-1 rounded-md justify-start items-center ${pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'}`}>
                                                                <input
                                                                    id={alternativa.id}
                                                                    type="checkbox"
                                                                    name={pergunta.id}
                                                                    value={alternativa.id}
                                                                    checked={pergunta.alternativa.find(a => a.id === alternativa.id)?.isChecked}
                                                                    onChange={() => atualizarResposta(pergunta.id, alternativa.id, alternativa.id, pergunta.tipoPerguntaId)}
                                                                    disabled={pergunta.isDisabled}
                                                                />
                                                                <label className='pl-2' htmlFor={alternativa.id}>{alternativa.descricao}</label>
                                                            </div>
                                                        ))}

                                                        {isDebugging && <DebubArea pergunta={pergunta} resposta={respostas[pergunta.id]} limpar={limparSelecao} />}

                                                    </CardBody>
                                                </div>
                                            </Card>
                                        )
                                    }

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.TEXT) {
                                        return (
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.numero} - ${pergunta.descricao}`} />
                                                    <CardBody>

                                                        <div className={`flex p-1 rounded-md justify-start items-center ${pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'}`}>
                                                            {pergunta.mascaraResposta === 'idade' &&
                                                                <input
                                                                    className='rounded-md w-full'
                                                                    id={`txt-${pergunta.id}`}
                                                                    type='number'
                                                                    name={pergunta.id}
                                                                    value={pergunta.resposta}
                                                                    onChange={(e) => handleInputText(pergunta.id, e.target.value, pergunta.mascaraResposta)}
                                                                    onBlur={(e) => atualizarResposta(pergunta.id, "", e.target.value, pergunta.tipoPerguntaId)}
                                                                    disabled={pergunta.isDisabled}
                                                                    min={pergunta.valorMinimo}
                                                                    max={pergunta.valorMaximo}
                                                                    maxLength={2}



                                                                />
                                                            }
                                                            {pergunta.mascaraResposta !== 'idade' &&
                                                                <input
                                                                    className='rounded-md w-full'
                                                                    id={`txt-${pergunta.id}`}
                                                                    type='text'
                                                                    name={pergunta.id}
                                                                    value={pergunta.resposta}
                                                                    onChange={(e) => handleInputText(pergunta.id, e.target.value, pergunta.mascaraResposta)}
                                                                    onBlur={(e) => atualizarResposta(pergunta.id, "", e.target.value, pergunta.tipoPerguntaId)}
                                                                    disabled={pergunta.isDisabled}
                                                                />
                                                            }
                                                        </div>

                                                        {isDebugging && <DebubArea pergunta={pergunta} resposta={respostas[pergunta.id]} limpar={limparSelecao} />}


                                                    </CardBody>
                                                </div>
                                            </Card>
                                        )
                                    }

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.RANGE) {
                                        return (
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.numero} - ${pergunta.descricao}`} />
                                                    <CardBody>
                                                        <PerguntaRangeV2
                                                            props={pergunta}
                                                            isDisabled={pergunta.isDisabled}
                                                            inputValue={pergunta.resposta[0]}
                                                            min={pergunta.valorMinimo ? pergunta.valorMinimo : 0}
                                                            max={pergunta.valorMaximo ? pergunta.valorMaximo : 0}
                                                            step={pergunta.step ? pergunta.step : 0}
                                                            mascara={pergunta.mascaraResposta ? pergunta.mascaraResposta : ""}
                                                            handleInputText={handleInputText}
                                                            handleAtualizaResposta={atualizarResposta}
                                                            isSaving={false}
                                                        />

                                                        {isDebugging && <DebubArea pergunta={pergunta} resposta={respostas[pergunta.id]} limpar={limparSelecao} />}

                                                    </CardBody>
                                                </div>

                                            </Card>

                                        )
                                    }


                                })}



                        </div>
                    </div>


                    {!isValidForm && Object.keys(respostas).filter(key => respostas[key] !== "").length !== perguntas.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length &&

                        <Card faltaResponder={true} >
                            <span className='font-bold text-xl text-justify transition-all duration-700, text-red-900 tracking-tighter'>Você ainda não respondeu as pergutas abaixo:</span>
                            <span className='text-sm text-red-900 pb-2'>Clique no número da pergunta para responder.</span>
                            <div className='grid grid-cols-5 md:grid-cols-10 text-red-900 items-center'>
                                {
                                    perguntas.map((p, index) => {
                                        if (p.tipoPerguntaId !== TipoPerguntaEnum.TITULO && !p.isDisabled) {
                                            if (respostas[p.id] === "") {
                                                return (

                                                    <Link key={index} href={`#C-${p.id}`}>[ {p.numero} ] </Link>
                                                )
                                            }
                                        }
                                    })
                                }
                            </div>
                        </Card>

                    }

                    <Card faltaResponder={false} >
                        <Pergunta texto={"Agradecemos a sua participação! Clique no botão abaixo para enviar este formulário com os dados preenchidos."} />
                    </Card>

                    <div className='flex flex-row justify-center items-center mb-14 mt-10'>
                        <button disabled={isLoadingButtonFinish} onClick={handleValidaFormulario} className={`flex flex-row justify-center items-center text-xl font-semibold text-white rounded-md h-20 w-80 transition duration-300 ease-in-out bg-violet-500 hover:bg-violet-700`}>
                            {isLoadingButtonFinish && <LoadImage />}
                            Enviar Formulário
                        </button>
                    </div>

                    {perguntas &&
                        <footer className={`bg-slate-900 text-gray-300 fixed bottom-0 w-full justify-center text-center`}>
                            <span className='hidden'>{Object.keys(respostas).filter(key => respostas[key] !== "").length} de {perguntas.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length} -</span>
                            Você respondeu {Math.round(100 * Object.keys(respostas).filter(key => respostas[key] !== "").length / perguntas.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length)}%
                        </footer>
                    }

                </>



            }

            <ToastContainer />
        </>
    );
}

