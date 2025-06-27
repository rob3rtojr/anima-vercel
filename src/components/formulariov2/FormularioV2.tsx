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
import SubPergunta from '../formulario/SubPergunta/page';
import PerguntaRangeSoma from './PerguntaTextRangeSoma/page';
import InputMask from 'react-input-mask';

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
    const [isDebugging, ] = useState<boolean>(false)
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
            }  else {
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
        
        if (tipoPerguntaId === TipoPerguntaEnum.CHECKBOX || tipoPerguntaId === TipoPerguntaEnum.RADIO || tipoPerguntaId === TipoPerguntaEnum.SOMA) {

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
            } else if (tipoPerguntaId === TipoPerguntaEnum.SOMA) {
                var selecionados: string[] = []
                perguntasAux[perguntaIndex].alternativa[alternativaIndex].valor = valor
                perguntasAux[perguntaIndex].alternativa.map(a => {
                        selecionados.push(a.valor === "" || a.valor === undefined ? `${a.id}:0` : `${a.id}:${a.valor}`)
                })
                perguntasAux[perguntaIndex].somatorioResposta = perguntasAux[perguntaIndex].alternativa.reduce((total, item) => total + parseFloat(item.valor || '0'), 0)                
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
                toast.update(idToast, { render: `Resposta incluída com sucesso!`, type: "success", isLoading: false, autoClose: 2000 })
                if (alternativaId !== "")
                    desmarcaItensDependentes2(perguntaId, valor)

            } else {

                limparSelecao(perguntaId)

                toast.update(idToast, { render: `Ocorreu um erro! Tente novamente!`, type: "error", isLoading: false, autoClose: 2000 })

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

    
    async function desmarcaItensDependentes2(idPergunta: string, valorResposta: string) {

        const perguntasDependentes: string[] = []
        var possuiResposta: boolean = false

        possuiResposta = valorResposta === "" ? false : true

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

        if (perguntasDependentes.length >0) {
            
            const idToast = toast.loading("Aguarde, Verificando itens dependentes...")

            //limpa a resposta
            perguntasDependentes.forEach((pd)=> {
                setRespostas(prevRespostas => ({
                    ...prevRespostas,
                    [pd]: ''
                }));  

                limparRespostaPorId(pd)
            })

            //console.log("perguntasDependentes", JSON.stringify(perguntasDependentes))
            //console.log("perguntasDependentes-join", perguntasDependentes.join(','))

            //grava respostas 
            try {
                
                const resp = await api.post("/deletaResposta", {
                    tipo: session?.user.role,
                    listaIdPergunta: JSON.stringify(perguntasDependentes),
                    pessoaId: session?.user.id
                }, {
                    headers: { 'Authorization': `Bearer ${session?.user.accessToken}` }
               })        
               
               toast.update(idToast, { render: `Perguntas dependentes atualizadas!`, type: "success", isLoading: false, autoClose: 3000 })

            } catch (error) {

                //caso tenha ocorrido algum erro, desmarcar item pai para que o usuário faça o processo novamente
                setRespostas(prevRespostas => ({
                    ...prevRespostas,
                    [idPergunta]: ''
                }));
                
                desmarcarAlternativas(idPergunta)

                toast.update(idToast, { render: `Ocorreu um erro ao atualizar itens dependentes!`, type: "error", isLoading: false, autoClose: 3000 })
            }           


        }

    }

    const desmarcarAlternativas = (perguntaId: string) => {
        setPerguntas((prevPerguntas) =>
            prevPerguntas.map((pergunta) => {
                // Verifica se o ID da pergunta corresponde
                if (pergunta.id === perguntaId) {
                    // Define isChecked como false para todas as alternativas
                    const alternativasAtualizadas = pergunta.alternativa.map((alternativa) => ({
                        ...alternativa,
                        isChecked: false,
                    }));
                    
                    // Retorna a pergunta com as alternativas atualizadas
                    return { ...pergunta, alternativa: alternativasAtualizadas };
                }
                
                // Retorna a pergunta sem modificações
                return pergunta;
            })
        );
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

        //const faltaResponderTextRangeSoma: number = perguntas.filter(f => f.tipoPerguntaId === TipoPerguntaEnum.SOMA).filter(i => i.somatorioResposta === 0)?.length
        
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInvalido: number = perguntas
        .filter(p => p.mascaraResposta === 'email')
        .filter(p => {
            const resposta = respostas[p.id] ?? '';
            return !regexEmail.test(resposta); // retorna true se inválido
        }).length;

        //console.log('emailInvalido', emailInvalido)

        if (faltaResponder !== totalPergunta || emailInvalido !==0) {
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

    function ordenarPerguntas(formulario: PerguntaType[]): PerguntaType[] {
        // Primeiro, separe o bloco 1 do restante
        const bloco1 = formulario.filter((f) => f.bloco === 1);
        const bloco2 = formulario.filter((f) => f.bloco === 2);

        const outrosBlocos = formulario.filter((f) => f.bloco !== 1 && f.bloco !==2);

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

        const result: PerguntaType[] = [...bloco1,...bloco2, ...blocosAleatorios.flat()]
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
                //aleatoriza as perguntas dentro do bloco
                //const responsOrdenado = ordenarPerguntas(response)
                //setPerguntas(responsOrdenado)
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
                                <h1 className="font-alt text-2xl md:text-4xl tracking-tight text-gray-200">{nomeFormulario}</h1>
                                {/* <p className='text-gray-400 text-sm'>Questionário de {nomeFormulario} para {session?.user.role === 'professor' ? 'servidores' : 'alunos'}</p> */}
                                {/* <h1 className="font-alt text-4xl tracking-tight text-gray-200">Questionário</h1>
                                <p className='text-gray-400 text-sm'>Sua colaboração neste questionário é essencial para aprofundarmos nossa compreensão
                                    sobre o perfil de gestores pedagógicos (coordenadores, gestores, assessores, coordenadores
                                    de área, etc). Por gentileza, responda às seguintes perguntas com base em suas experiências
                                    e na sua situação atual.</p> */}
                            </div>
                        </header>

                        <div className="flex flex-col just">
                            {
                                perguntas.map((pergunta, index) => {

                                    let isDisabledItemCheckBox: boolean = false;
                                    let isDisabled: boolean | undefined = false;
                                    let marcaFaltaResponder: boolean = false

                                    marcaFaltaResponder = !pergunta.isDisabled && isFinishClick && respostas[pergunta.id] === '' ? true : false
                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.SOMA) {
                                        marcaFaltaResponder = !pergunta.isDisabled && isFinishClick && (pergunta.somatorioResposta === 0 || pergunta.somatorioResposta === undefined) ? true : false
                                    }
                                    if (pergunta.mascaraResposta === 'email' && respostas[pergunta.id] !== '') {
                                        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        const valorEmail = respostas[pergunta.id] ?? ''; // garante string
                                        marcaFaltaResponder = !regexEmail.test(valorEmail); 
                                    }

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

                                    //LIMITA A QUANTIDADE DE ITENS MARCADOS EM UM CHECKBOX, CASO O valorMaximo seja definido
                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.CHECKBOX) {
                                        if (!isDisabled) {
                                            if (pergunta.valorMaximo) {
                                                const totalItensMarcados = respostas[pergunta.id]?.split(',').length ?? 0
                                                if (totalItensMarcados >= pergunta.valorMaximo) {
                                                    isDisabledItemCheckBox = true
                                                }
                                            }
                                        }
                                    }


                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.TITULO) {
                                        return (
                                            // <Card faltaResponder={false} key={pergunta.id} className={"bg-white"}>
                                            //     <Pergunta texto={pergunta.descricao} />
                                            //      {pergunta.descricaoAuxiliar &&
                                            //      <SubPergunta className={"text-gray-400 text-lg md:text-xl italic"} key={pergunta.id} texto={pergunta.descricaoAuxiliar} />
                                            //      }                                                
                                            // </Card>
                                            <CardPergunta id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={false} >
                                                <Pergunta className={"text-white text-xl md:text-2xl"} key={index} texto={pergunta.descricao} />
                                                {pergunta.descricaoAuxiliar &&
                                                <SubPergunta className={"text-gray-400 text-lg md:text-xl italic"} key={pergunta.id} texto={pergunta.descricaoAuxiliar} />
                                                }
                                            </CardPergunta>
                                        )
                                    }

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.RADIO) {
                                        return (
                                            <React.Fragment key={pergunta.id}>
                                                <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder} hide={pergunta.isDisabled}>
                                                    <div>
                                                        {/* <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.sequencia} - ${pergunta.descricao}`} /> */}
                                                        <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.descricao}`} textoAuxiliar={pergunta.descricaoAuxiliar} />
                                                        {/* <SequenciaOriginal numeroOriginal={pergunta.identificador || ''} /> */}
                                                        <CardBody>
                                                            <div className={`flex ${pergunta.mascaraResposta === 'escala0a10' ? 'flex-col md:flex-row md:justify-between' : 'flex-col'}`}>
                                                            {pergunta.alternativa.map(alternativa => (

                                                                <div key={alternativa.id} className={`flex flex-row p-1 rounded-md justify-start items-center ${pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'} `}>
                                                                    <input
                                                                        id={alternativa.id}
                                                                        type="radio"
                                                                        name={pergunta.id}
                                                                        value={alternativa.id}
                                                                        checked={respostas[pergunta.id]?.toString() === alternativa.id.toString()}
                                                                        onChange={() => atualizarResposta(pergunta.id, alternativa.id, alternativa.id, pergunta.tipoPerguntaId)}
                                                                        disabled={pergunta.isDisabled || isSaving}
                                                                    />
                                                                    <label className={`md:pl-2`} htmlFor={alternativa.id}>{alternativa.descricao}</label>
                                                                </div>
                                                            ))}
                                                            </div>
                                                            {isDebugging && <DebubArea pergunta={pergunta} resposta={respostas[pergunta.id]} limpar={limparSelecao} />}
                                                        </CardBody>
                                                    </div>
                                                </Card>
                                            </React.Fragment>
                                        )
                                    }


                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.CHECKBOX) {
                                        return (
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder} hide={pergunta.isDisabled}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.descricao}`}  textoAuxiliar={pergunta.descricaoAuxiliar}/>
                                                    {/* <SequenciaOriginal numeroOriginal={pergunta.identificador || ''} /> */}
                                                    {/*<SequenciaOriginal numeroOriginal={pergunta.id || ''} />*/}
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
                                                                    disabled={pergunta.isDisabled ? pergunta.isDisabled : (!pergunta.alternativa.find(a => a.id === alternativa.id)?.isChecked && isDisabledItemCheckBox ? true : false )}
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
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder} hide={pergunta.isDisabled}>
                                                <div>
                                                    {/* <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.sequencia} - ${pergunta.descricao}`} /> */}
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.descricao}`} textoAuxiliar={`${pergunta.descricaoAuxiliar ?? ''}`} />
                                                    {/* <SequenciaOriginal numeroOriginal={pergunta.identificador || ''} /> */}
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

                                                            {pergunta.mascaraResposta === 'celular' &&
                                                                <InputMask
                                                                    mask='(99)99999-9999'
                                                                    className='rounded-md w-full'
                                                                    id={`txt-${pergunta.id}`}
                                                                    type='text'
                                                                    name={pergunta.id}
                                                                    value={pergunta.resposta}
                                                                    onChange={(e) => handleInputText(pergunta.id, e.target.value, pergunta.mascaraResposta)}
                                                                    onBlur={(e) => atualizarResposta(pergunta.id, "", e.target.value, pergunta.tipoPerguntaId)}
                                                                    disabled={pergunta.isDisabled}
                                                                    placeholder='(99)99999-9999'
                                                                />
                                                            }

                                                            {pergunta.mascaraResposta === 'email' &&
                                                                <div className='w-full'>
                                                                    <input
                                                                        className={`rounded-md w-full`}
                                                                        id={`txt-${pergunta.id}`}
                                                                        type='email'
                                                                        name={pergunta.id}
                                                                        value={pergunta.resposta}
                                                                        onChange={(e) => handleInputText(pergunta.id, e.target.value, pergunta.mascaraResposta)}
                                                                        onBlur={(e) => atualizarResposta(pergunta.id, "", e.target.value, pergunta.tipoPerguntaId)}
                                                                        disabled={pergunta.isDisabled}
                                                                        placeholder='exemplo@gmail.com'
                                                                    />
                                                                    {marcaFaltaResponder &&
                                                                        <span className='text-red-900 font-semibold'>Formato de email inválido</span>
                                                                    }
                                                                </div>
                                                            }  

                                                            {!pergunta.mascaraResposta &&
                                                                <input
                                                                    className='rounded-md w-full'
                                                                    id={`txt-${pergunta.id}`}
                                                                    type='text'
                                                                    name={pergunta.id}
                                                                    value={pergunta.resposta}
                                                                    onChange={(e) => handleInputText(pergunta.id, e.target.value, pergunta.mascaraResposta)}
                                                                    onBlur={(e) => atualizarResposta(pergunta.id, "", e.target.value, pergunta.tipoPerguntaId)}
                                                                    disabled={pergunta.isDisabled}
                                                                    placeholder={pergunta.mascaraResposta} //'digite aqui sua resposta'
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
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder} hide={pergunta.isDisabled}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.descricao}`} />
                                                    {/* <SequenciaOriginal numeroOriginal={pergunta.identificador || ''} /> */}
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

                                    if (pergunta.tipoPerguntaId === TipoPerguntaEnum.SOMA) {
                                        return(
                                            <Card id={`C-${pergunta.id}`} key={pergunta.id} faltaResponder={marcaFaltaResponder} hide={pergunta.isDisabled}>
                                                <div>
                                                    <Pergunta isDisabled={pergunta.isDisabled} texto={`${pergunta.numero} - ${pergunta.descricao}`}  textoAuxiliar={pergunta.descricaoAuxiliar}/>
                                                    {/* <SequenciaOriginal numeroOriginal={pergunta.identificador || ''} /> */}
                                                    <CardBody>
                                                        {(() => {
                                                            // Converte a string de resposta em um dicionário { id: valor }
                                                            const respostaMap = Object.fromEntries(
                                                            (pergunta.resposta?.[0] || "")
                                                                .split(',')
                                                                .map(pair => {
                                                                const [id, valor] = pair.split(':');
                                                                return [id, valor];
                                                                })
                                                            );

                                                            return pergunta.alternativa.map(alternativa => (
                                                            <div
                                                                key={alternativa.id}
                                                                className={`flex flex-col border-b-2 border-b-slate-300 lg:flex-row pb-8 p-1 rounded-md justify-start lg:items-end ${
                                                                pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'
                                                                }`}
                                                            >
                                                                <div className="lg:w-[45%] md:pr-4">
                                                                <label className="lg:pl-2" htmlFor={alternativa.id}>
                                                                    {alternativa.descricao}
                                                                </label>
                                                                </div>

                                                                <PerguntaRangeSoma
                                                                idAlternativa={alternativa.id}
                                                                props={pergunta}
                                                                isDisabled={pergunta.isDisabled}
                                                                inputValue={respostaMap[alternativa.id.toString()] ?? alternativa.valor}
                                                                min={pergunta.valorMinimo ?? 0}
                                                                max={pergunta.valorMaximo ?? 0}
                                                                step={pergunta.step ?? 0}
                                                                mascara={pergunta.mascaraResposta ?? ''}
                                                                handleInputText={handleInputText}
                                                                handleAtualizaResposta={atualizarResposta}
                                                                isSaving={false}
                                                                />
                                                            </div>
                                                            ));
                                                        })()}     
                                                            <div
                                                                className={`flex flex-col border-b-2 border-b-slate-300 lg:flex-row pb-8 p-1 rounded-md justify-start lg:items-end ${
                                                                pergunta.isDisabled ? 'text-gray-400' : 'hover:bg-gray-100 transition-all'
                                                                }`}
                                                            >
                                                                <div className="lg:w-[45%] md:pr-4">
                                                                    <label className="lg:pl-2">
                                                                        Total:
                                                                    </label>                                                                    
                                                                </div>      
                                                                <div
                                                                className={`flex flex-col w-full pr-8 font-semibold text-xl ${
                                                                    (() => {
                                                                    const soma = respostas[pergunta.id]
                                                                        ?.split(',')
                                                                        .map(par => parseFloat(par.split(':')[1] || '0'))
                                                                        .reduce((acc, valor) => acc + valor, 0)

                                                                    return soma === 100 ? 'text-green-600' : 'text-red-600'
                                                                    })()
                                                                }`}
                                                                >
                                                                {(() => {
                                                                    const soma = respostas[pergunta.id]
                                                                    ?.split(',')
                                                                    .map(par => parseFloat(par.split(':')[1] || '0'))
                                                                    .reduce((acc, valor) => acc + valor, 0)

                                                                    return `${soma} %`
                                                                })()}
                                                                </div>                                                                                                                   
                                                            </div>                                                                                                           
                                                        {isDebugging && <DebubArea pergunta={pergunta} resposta={respostas[pergunta.id]} limpar={limparSelecao} />}

                                                    </CardBody>
                                                </div>
                                            </Card>                                            
                                        )
                                    }


                                })}

                        </div>
                    </div>


                    {!isValidForm && (
                        Object.keys(respostas).filter(key => respostas[key] !== "").length !== perguntas.filter(f => f.tipoPerguntaId !== TipoPerguntaEnum.TITULO && f.isDisabled === false)?.length 
                        || 
                        perguntas.filter(f => f.tipoPerguntaId === TipoPerguntaEnum.SOMA && f.isDisabled === false && f?.somatorioResposta === 0).length > 0
                        ) &&

                        <Card faltaResponder={true} >
                            
                            {params.formularioId !== "11" &&
                                <>
                                    <span className='font-bold text-xl text-justify transition-all duration-700, text-red-900 tracking-tighter'>Você ainda não respondeu as pergutas abaixo:</span>
                                    <span className='text-sm text-red-900 pb-2'>Clique no número da pergunta para responder.</span>
                                    <div className='grid grid-cols-5 md:grid-cols-10 text-red-900 items-center'>
                                        {
                                            perguntas.map((p, index) => {
                                                if (p.tipoPerguntaId !== TipoPerguntaEnum.TITULO && !p.isDisabled) {
                                                    if (respostas[p.id] === "" || respostas[p.id] === undefined || (p.tipoPerguntaId === TipoPerguntaEnum.SOMA && p?.somatorioResposta === 0)) {
                                                        return (
                                                            <Link key={p.id} href={`#C-${p.id}`}>[ {p.numero} ] </Link>
                                                        )
                                                    }
                                                }
                                            })
                                        }
                                    </div>
                                </>
                            }
                            {params.formularioId === "11" &&
                                <span className='font-bold text-xl text-justify transition-all duration-700, text-red-900 tracking-tighter'>Você ainda não respondeu as perguntas sinalizadas em vermelho. Só será possível enviar o formulário após responder todas as perguntas</span>
                            }
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

