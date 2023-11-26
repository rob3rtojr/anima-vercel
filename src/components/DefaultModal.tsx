'use client';

import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import LoadImage from './elements/LoadImage';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

type PropsType = {
  setIsModalOpen: (isModalOpen: boolean) => void,
  handleAccept: (accept: boolean) => void,
  isModalOpen: boolean,
  isLoading: boolean,
  estadoLogado: string,
  nome: string,
  tipo: string,
  duracao: string
}

type DadosEstado = {
  sigla: string,
  descricao: string,
  secretaria: string,
  secretariaAbrebiado: string
}

export default function DefaultModal(props: PropsType) {
  const [passo, setPasso] = useState<number>(1)
  const [extra, setExtra] = useState<boolean>(false)
  const [estadoLogado, setEstadoLogado] = useState<DadosEstado>()
  const dadosEstado: DadosEstado[] = [
    {
      "sigla": "GO",
      "descricao": "Goiás",
      "secretaria": "Secretaria de Estado da Educação de Goiás",
      "secretariaAbrebiado": "SEDUC-GO"
    },
    {
      "sigla": "MG",
      "descricao": "Minas Gerais",
      "secretaria": "Secretaria de Estado da Educação de Minas Gerais",
      "secretariaAbrebiado": "SEE-MG"
    },
    {
      "sigla": "PA",
      "descricao": "Pará",
      "secretaria": "Secretaria de Estado da Educação do Pará",
      "secretariaAbrebiado": "SEDUC-PA"
    },
  ]

  useEffect(() => {
    const dados: DadosEstado | undefined = dadosEstado.find((e) => e.sigla === props.estadoLogado)
    setEstadoLogado(dados)
    setPasso(1)
  }, [])

  const handleExtra = () => {
    setExtra(!extra)
  }

  return (
    <>
      <Modal show={props.isModalOpen} onClose={() => props.setIsModalOpen(false)}>
        <Modal.Header>Termo de consentimento/assentimento livre e esclarecido</Modal.Header>
        <Modal.Body>
          {passo === 1 && !extra &&
            <div className="space-y-6">

              <p className="text-base leading-relaxed text-gray-500 text-justify">
                Olá, <b>{props.nome}</b>. Esse questionário faz parte de uma ampla pesquisa que a {estadoLogado?.secretaria} vem realizando para assegurar a continuidade de ações que poderão impactar positivamente a educação pública no estado. As perguntas serão sobre você, seus hábitos e suas perspectivas em relação à sua escola. É fundamental que você responda com seriedade todo o questionário.
              </p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">
                A participação nesta avaliação é voluntária, porém sua contribuição é muito <b>importante</b> para que juntos possamos avançar rumo a um futuro melhor para você e outros jovens do nosso estado.
              </p>

              <p className="text-base leading-relaxed text-gray-500 text-justify">
                Vale dizer que se trata de um <b>questionário anônimo</b> - {props.tipo === "aluno" ? 'sua família, seus amigos, colegas e professores da escola' : 'alunos, colegas, e gestores da escola ou da secretaria de educação'} não saberão de nada do que você responder aqui – e <b>suas respostas não terão nenhum efeito {props.tipo === "aluno" ? 'nas suas notas ou no seu desempenho escolar' : 'na sua carreira'}</b>.
              </p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">
                O conteúdo desta pesquisa subsidiará ações internas da {estadoLogado?.secretariaAbrebiado} e os dados pessoais fornecidos serão tratados com segurança, conforme a LGPD e demais Leis de Proteção de Dados Aplicáveis;
              </p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">
                O tempo médio para finalizar o preenchimento desse questionário é de <b>{props.duracao}</b>. As questões são de preenchimento obrigatório para o consequente avanço. <b>Não há respostas certas ou erradas</b>, o importante é que seja sincero(a) em todo momento.
              </p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">
                Obrigado!
              </p>
            </div>
          }
          {passo === 2 && !extra &&
            <div className="space-y-6">

              <p className="text-base leading-relaxed text-gray-500 text-justify">
                Este questionário é resultado da parceria entre a {estadoLogado?.secretaria} ({estadoLogado?.secretariaAbrebiado}) e o Instituto Ânima. Esse é um ponto de coleta de dado pessoal. Para mais informações, <a className='cursor-pointer underline hover:text-blue-800' onClick={handleExtra}>clique aqui.</a>
              </p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">
                Assinale abaixo se você concorda em participar da pesquisa:
              </p>
            </div>
          }
          {
            extra &&
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 text-justify">“Este questionário é resultado da parceria entre a {estadoLogado?.secretaria} ({estadoLogado?.secretariaAbrebiado})  e o Instituto Ânima. Esse é um ponto de coleta de dado pessoal. Os dados pessoais são usados pelo INSTITUTO ÂNIMA SOCIESC DE INOVAÇÃO, PESQUISA E CULTURA (CNPJ – 07.749.605/0003-90) para o cumprimento de metas e objetivos no Acordo de Cooperação Técnica assinado com a {estadoLogado?.secretariaAbrebiado}, além de serem usados para enriquecer a sua experiência ao utilizar os nossos serviços. Confira, na íntegra, o nosso aviso externo de privacidade <a className='cursor-pointer underline hover:text-blue-800' href='https://www.institutoanimaeducacao.org.br/privacidade/' target='_blank'>neste link.</a></p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">Sempre que quiser, poderá pedir mais informações por meio do contato da Encarregada de Dados (DPO) do Instituto Ânima (privacidade@institutoanimaeducacao.org.br), Paula Starling.</p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">Serão coletados neste questionário alguns dados pessoais como gênero, cor ou raça, idade e características do seu domicílio. Além disso, perguntamos sobre suas opiniões, atitudes, comportamentos, hábitos e algumas características da sua personalidade. Ao aceitar participar desta pesquisa você declara estar ciente que:</p>
              <ul>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Os Dados Pessoais fornecidos serão tratados com segurança, conforme a LGPD e com as demais Leis de Proteção de Dados Aplicáveis;</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	As informações obtidas através da sua participação não permitirão a identificação da sua pessoa, exceto para a equipe de pesquisa, e a divulgação das mencionadas informações agregadas e/ou anonimizadas só será feita entre as instituições, profissionais e parceiros do estudo;</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Você tem direito de solicitar acesso, retificação ou eliminação dos seus Dados Pessoais, ou revogar o seu consentimento, sem que isso lhe traga qualquer penalidade ou prejuízo.</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Os dados agregados (e apenas os agregados) serão divulgados para a Rede de Ensino.”</p></li>
              </ul>
            </div>
          }

        </Modal.Body>
        {passo === 2 && !extra &&
          <Modal.Footer>
            <div className='flex md:flex-row flex-col justify-between w-full gap-2'>

              <button onClick={() => props.handleAccept(true)} className='flex justify-center items-center md:w-[50%] w-full text-white rounded-md p-1 h-24 bg-green-500 transition duration-300 ease-in-out hover:bg-green-700'>
                {props.isLoading && <LoadImage />}
                {!props.isLoading && "Eu declaro que entendi os objetivos, riscos e benefícios da participação nesta pesquisa, e que concordo em participar."}
              </button>

              <button color="gray" onClick={() => props.handleAccept(false)} className='md:w-[50%] w-full text-white rounded-md p-1 h-24 bg-red-500 transition duration-300 ease-in-out hover:bg-red-700'>
                Eu não concordo em participar desta pesquisa.
              </button>

            </div>
          </Modal.Footer>
        }
        {extra &&
          <Modal.Footer>
            <div className='flex md:flex-row flex-col justify-between w-full gap-2'>

              <button onClick={handleExtra} className='flex justify-center items-center w-full text-white rounded-md p-1 h-12 bg-green-500 transition duration-300 ease-in-out hover:bg-green-700'>
                Voltar
              </button>


            </div>
          </Modal.Footer>
        }
        <div className='flex flex-row justify-between items-center pt-2 p-4'>
          <div>{passo > 1 && !extra && <button onClick={() => setPasso(passo - 1)} className='flex flex-row justify-between items-center text-blue-800'><ArrowBigLeft />Anterior</button>}</div>
          <div>{passo < 2 && !extra && <button onClick={() => setPasso(passo + 1)} className='flex flex-row justify-between items-center text-blue-800'>Próximo <ArrowBigRight /></button>}</div>
        </div>
      </Modal>
    </>
  )
}


