'use client'
import { api } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PerguntaType } from "@/Types/types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TipoPerguntaEnum } from '@/enum/TipoPergunta';
import Loading from '../Loading';
import { Card, CardBody, CardPergunta } from '../formulario/Card/page';
import Pergunta from '../formulario/Pergunta/page';
import PerguntaRangeV2 from './PerguntaTextRangeV2/page';
import LoadImage from '../elements/LoadImage';
import DebubArea from './DebugArea';
import Link from "next/link";
import SequenciaOriginal from '../formulario/SequenciaOriginal/page';

type EstadoProps = {
    id: number;
    nome: string;
    sigla: string;
};


export default function FormularioSA({ params }: { params: { formularioId: string, estado: string, escolaId: string, municipioId: string, turmaId: string } }) {

    const router = useRouter()
    const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL

    // Resposta para armazenar os respostas de todos os grupos de radio buttons

    const [respostas, setRespostas] = useState<{ [key: string]: string | null }>({});
    const [perguntas, setPerguntas] = useState<PerguntaType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFinishClick, setIsFinishClick] = useState<boolean>(false);
    const [isLoadingButtonFinish, setIsLoadngButtonFinish] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isDebugging] = useState<boolean>(false)
    const [isValidForm, setIsValidForm] = useState<boolean>(true)
    const [podePreencher, setPodePreencher] = useState<boolean>(true)
    const [nomeFormulario, setNomeFormulario] = useState<string>("")
    const [tipoFormulario, setTipoFormulario] = useState<string>("")
    const [finalizado, setFinalizado] = useState<boolean>(false)
    const [estado, setEstado] = useState<EstadoProps>({ id: 0, nome: "", sigla: "" });


    function handleInputText(idPergunta: string, value: string, mascaraResposta?: string) {

        const perguntaIndex = perguntas ? perguntas?.findIndex((pergunta) => pergunta.id === idPergunta) : -1;

        if (perguntaIndex !== -1 && perguntas) {
            const formularioAtualizado = [...perguntas]; // Faz uma cópia do estado atual
            //console.log('formularioAtualizado',formularioAtualizado)

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
        // const idToast = toast.loading("Aguarde...")
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

        //desmarcaItensDependentes(perguntaId, alternativaId, valor)
        desmarcaItensDependentes2(perguntaId)
        //apagaRespostaPerguntaDesabilitada()
        //apagaRespostaItensDesabilitados()

        setIsSaving(false)
        //console.log(respostas)
    };

    const limparRespostaPorId = (perguntaId: string) => {

        setRespostas(prevRespostas => ({
            ...prevRespostas,
            [perguntaId]: ''
        }));


        let perguntasAux = [...perguntas]
        const perguntaIndex = perguntasAux ? perguntasAux.findIndex((pergunta) => pergunta.id === perguntaId) : -1;
        perguntasAux[perguntaIndex].resposta = []

        setPerguntas(perguntasAux)

    };

    // Função para limpar o valor selecionado em um grupo
    const limparSelecao = (perguntaId: string) => {

        setRespostas(prevRespostas => ({
            ...prevRespostas,
            [perguntaId]: ''
        }));


        let perguntasAux = [...perguntas]
        const perguntaIndex = perguntasAux ? perguntasAux.findIndex((pergunta) => pergunta.id === perguntaId) : -1;

        perguntasAux[perguntaIndex].alternativa.map(a => {
            a.isChecked = false;
        })

        perguntasAux[perguntaIndex].resposta = []

        setPerguntas(perguntasAux)

    };

    async function handleValidaFormulario() {

        setIsLoadngButtonFinish(true)
        setIsFinishClick(true)

        const respostaAux = respostas

        perguntas.forEach((f, index) => {
            if (perguntas[index].isDisabled) {
                respostaAux[perguntas[index].id] = '';
            }
        })

        setRespostas(respostaAux)

        const faltaResponder: number = Object.keys(respostas).filter(key => respostas[key] !== "").length
        const totalPergunta: number = perguntas.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length


        if (faltaResponder !== totalPergunta) {
            toast.error("Você ainda não finalizou o preenchimento do formulário. Verifique as perguntas em vermelho.")
            setIsLoadngButtonFinish(false)
            setIsValidForm(false)

            //console.log('perguntas', perguntas)
            //console.log('respostas', respostas)

        } else {

            const idToast = toast.loading("Aguarde, Finalizando...")
            setIsValidForm(true)

            //SALVAR AS RESPOSTAS
            setIsSaving(true)

            const resp = api.post("/respostaSA", {
                tipo: tipoFormulario,
                estadoId: estado.id,
                municipioId: params.municipioId,
                escolaId: params.escolaId,
                turmaId: params.turmaId,
                resposta: JSON.stringify(respostas)
            }).then(resp => {
                if (resp.status === 200) {
                    setIsSaving(false)
                    toast.update(idToast, { render: `Questionário incluído com sucesso!`, type: "success", isLoading: false, autoClose: 2000 })
                    setTimeout(() => {
                        router.push(`/finalizado`);
                    }, 3000);

                    setFinalizado(true)
                } else {

                    toast.update(idToast, { render: `Ocorreu um erro! Tente novamente!`, type: "error", isLoading: false, autoClose: 2000 })
                    setIsSaving(false)
                    setIsLoadngButtonFinish(false)
                }
            }).catch(
                error => {

                    toast.update(idToast, { render: `Ocorreu um erro de conexão com o servidor. Tente novamente!`, type: "error", isLoading: false, autoClose: 2000 })
                    setIsSaving(false)
                    setIsLoadngButtonFinish(false)
                }
            )


        }

    }


    function ordenarPerguntas(formulario: PerguntaType[]): PerguntaType[] {
        // Primeiro, separe o bloco 1 do restante
        const bloco1 = formulario.filter((f) => f.bloco === 1);
        const bloco2 = formulario.filter((f) => f.bloco === 2);
        const outrosBlocos = formulario.filter((f) => f.bloco !== 1 && f.bloco !== 2);

        // Agrupe as perguntas por bloco (exceto bloco 1)
        const blocosAgrupados: { [key: number]: PerguntaType[] } = outrosBlocos.reduce(
            (acc, curr) => {
                if (curr.bloco) {
                    if (!acc[curr.bloco]) {
                        acc[curr.bloco] = [];
                    }
                    acc[curr.bloco].push(curr);
                }
                return acc;
            },
            {} as { [key: number]: PerguntaType[] }
        );

        // Embaralhe os blocos (exceto o bloco 1)
        const blocosAleatorios = Object.values(blocosAgrupados)
            .map((bloco) => ({ bloco, sortKey: Math.random() }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ bloco }) => bloco);

        const result: PerguntaType[] = [...bloco1, ...bloco2, ...blocosAleatorios.flat()]
        let novaSequencia: number = 0
        result.forEach((r) => {
            if (r.tipoPerguntaId !== 4) {
                novaSequencia++;
                r.sequencia = novaSequencia;
            }
        });
        //console.log('result', result)

        // Retorne o bloco 1 seguido pelos blocos embaralhados
        return result;
    }

    async function desmarcaItensDependentes2(idPergunta: string) {

        const perguntasDependentes: string[] = []

        //localiza as perguntas que escutam a alternativa
        perguntas.map((pergunta, index) => {

            pergunta.escutar.map((e) => {

                if (e.escutarPerguntaId.toString() === idPergunta.toString()) {
                    if (!perguntasDependentes.includes(pergunta.id)) {
                        perguntasDependentes.push(pergunta.id);
                    }
                }
            })

        })

        if (perguntasDependentes.length > 0) {
            //limpa a resposta
            perguntasDependentes.forEach((pd) => {
                setRespostas(prevRespostas => ({
                    ...prevRespostas,
                    [pd]: ''
                }));
                //debugger
                limparRespostaPorId(pd);
            })
        }
    }


    // Carregar dados da API e inicializar respostas
    useEffect(() => {

        const fetchOptions = async () => {

            try {

                const estadoAPI = await api.get(`${baseUrl}/estadosgeral/${params.estado}`)
                const { id, sigla, nome } = estadoAPI.data
                setEstado({ id, sigla, nome });

                const formularioAPI = await api.get(`${baseUrl}/tipoFormularios/${params.formularioId}`)
                const { nome: nomeForm, tipo } = formularioAPI.data
                setNomeFormulario(nomeForm)
                setTipoFormulario(tipo)

                const res = await fetch(`${baseUrl}/formularioSA/${params.formularioId}`, {
                    method: "Get",
                    headers: {
                        'Cache-Control': 'no-store',
                        'Expires': '0',
                    }
                })

                if (res.status === 401) {
                    setPodePreencher(false)
                }


                const response = await res.json();

                if (response.length === 0) {
                    setPodePreencher(false)
                }

                const responsOrdenado = ordenarPerguntas(response)
                setPerguntas(responsOrdenado)

                const respostasIniciais: { [key: string]: string | null } = {};
                setRespostas(respostasIniciais)

                setIsLoading(false)

            }
            catch (err: any) {

                toast.error(`Ocorreu um erro. Tente novamente. Erro: ${err.message}`)
                return
            }
        }


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

    }, [])

    return (
        <>
            {isLoading && <Loading />}
            {!podePreencher &&

                <header className="bg-slate-750 mt-20">
                    <div className="flex flex-col justify-center gap-1 items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="font-alt text-4xl tracking-tight text-gray-200">Ops...</h1>
                        <p className='text-gray-400 text-sm'>Questionário não encontrado!</p>
                    </div>
                </header>

            }
            {!isLoading && podePreencher && !finalizado &&
                <>
                    <div className='flex flex-col'>

                        <header className="bg-slate-750 mt-20">
                            <div className="flex flex-col justify-center gap-1 items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                <h1 className="font-alt text-4xl tracking-tight text-gray-200">{nomeFormulario}</h1>
                                <p className='text-gray-400 text-sm'>Questionário de {nomeFormulario} para {tipoFormulario === 'aluno' ? 'alunos' : 'professores'} - {estado.nome}</p>
                            </div>
                        </header>

                        <div className="flex flex-col just">
                            {
                                perguntas.map((pergunta, index) => {


                                    let isDisabled: boolean | undefined = false;
                                    let marcaFaltaResponder: boolean = false

                                    marcaFaltaResponder = isFinishClick && ((respostas[pergunta.id] === '' || respostas[pergunta.id] === undefined) && !pergunta.isDisabled) ? true : false

                                    if (pergunta.escutar.length > 0) {
                                        isDisabled = true;
                                    }

                                    for (let i = 0; i < pergunta.escutar.length; i++) {

                                        isDisabled = !perguntas.find(f => f.id === pergunta.escutar[i].escutarPerguntaId)?.alternativa.find(a => a.id === pergunta.escutar[i].escutarAlternativaId)?.isChecked
                                        if (!isDisabled) {

                                            break;
                                        }
                                    }

                                    if (isDisabled) {
                                        marcaFaltaResponder = false
                                    } else {
                                        marcaFaltaResponder = isFinishClick && ((respostas[pergunta.id] === '' || respostas[pergunta.id] === undefined)) ? true : false
                                    }


                                    pergunta.isDisabled = isDisabled

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.TITULO) {
                                        return (
                                            <CardPergunta key={pergunta.id} id={`C-${pergunta.id}`} className={"text-white bg-gray-800"} faltaResponder={false} >
                                                <Pergunta className={"text-gray-400 text-xl md:text-2xl"} key={index} texto={pergunta.descricao} />
                                            </CardPergunta>
                                        )
                                    }

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.RADIO) {
                                        return (
                                            <React.Fragment key={pergunta.id}>
                                                <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder}>
                                                    <div>
                                                        <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.sequencia} - ${pergunta.descricao}`} />
                                                        <SequenciaOriginal numeroOriginal={pergunta.numero} />
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
                                            </React.Fragment>
                                        )
                                    }


                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.CHECKBOX) {
                                        return (
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.sequencia} - ${pergunta.descricao}`} />
                                                    <SequenciaOriginal numeroOriginal={pergunta.numero} />
                                                    <CardBody>
                                                        {pergunta.alternativa.map(alternativa => (

                                                            <div key={alternativa.id} className={`flex p-1 rounded-md justify-start items-center ${pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'}`}>
                                                                <input
                                                                    id={alternativa.id}
                                                                    type="checkbox"
                                                                    name={pergunta.id}
                                                                    value={alternativa.id}
                                                                    checked={alternativa.isChecked || false}
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
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.sequencia} - ${pergunta.descricao}`} />
                                                    <SequenciaOriginal numeroOriginal={pergunta.numero} />
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
                                                                    placeholder='digite aqui'
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
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.sequencia} - ${pergunta.descricao}`} />
                                                    <SequenciaOriginal numeroOriginal={pergunta.numero} />
                                                    <CardBody>
                                                        <PerguntaRangeV2
                                                            props={pergunta}
                                                            isDisabled={pergunta.isDisabled}
                                                            inputValue={"0"}
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
                                            if (respostas[p.id] === "" || respostas[p.id] === undefined) {
                                                return (

                                                    <Link key={p.id} href={`#C-${p.id}`}>[ {p.sequencia} ] </Link>
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
            {isDebugging &&
                <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
                    {
                        JSON.stringify(respostas)
                    }
                </div>
            }
            <ToastContainer />
        </>
    );
}

