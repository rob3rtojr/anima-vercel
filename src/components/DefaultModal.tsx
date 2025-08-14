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
  duracao: string,
  formularioId: number
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
      "secretaria": "Secretaria de Estado de Educação de Minas Gerais",
      "secretariaAbrebiado": "SEE-MG"
    },
    {
      "sigla": "PA",
      "descricao": "Pará",
      "secretaria": "Secretaria de Estado da Educação do Pará",
      "secretariaAbrebiado": "SEDUC-PA"
    },
    {
      "sigla": "BA",
      "descricao": "Bahia",
      "secretaria": "Secretaria de Estado da Educação da Bahia",
      "secretariaAbrebiado": "SEDUC-BA"
    },    
    {
      "sigla": "SP",
      "descricao": "São Paulo",
      "secretaria": "Secretaria de Estado da Educação de São Paulo",
      "secretariaAbrebiado": "SEDUC-SP"
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

              {props.tipo === 'professor' && props.formularioId === 10 &&
                <>
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Olá, <b>{props.nome}</b>
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Você está sendo convidado(a) a participar de uma pesquisa sobre coordenação 
                    pedagógica no âmbito do Acordo de Cooperação entre a {estadoLogado?.secretaria} e o Instituto Ânima (CNPJ – 07.749.605/0003-90).
                    A avaliação tem como objetivo produzir evidências sobre o papel do(a) coordenador(a) pedagógico(a) e suas atribuições, bem como identificar os desafios e oportunidades relacionadas à essa função na rede paulista.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    As perguntas incluem o mapeamento de informações sobre seu perfil, como dados
                    pessoais (gênero, cor ou raça, idade e características do seu domicílio) e sua trajetória
                    profissional e acadêmica (qualificação e especialização para o exercício da
                    coordenação pedagógica), e suas percepções em situações comuns na rotina da escola.           
                  </p>       

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Ao responder, considere exclusivamente seu vínculo na Rede Estadual,
                    independentemente de você possuir vínculos ou experiências em outras redes.                
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    {/* Esta pesquisa é <b>anônima</b> - {props.tipo === "aluno" ? 'sua família, seus amigos, colegas e professores da escola' : 'estudantes, colegas ou outros profissionais da SEDUC'}  */}
                    Esta pesquisa é <b>anônima</b> - estudantes, colegas ou outros profissionais da SEDUC
                    não terão acesso a informações nominais, somente às informações agregadas e/ou anonimizadas.
                    Os dados pessoais fornecidos serão tratados com segurança, conforme a Lei Geral de
                    Proteção de Dados (LGPD) e demais leis de proteção de dados aplicáveis. Confira, na
                    íntegra, o nosso aviso externo de privacidade <a className='cursor-pointer underline hover:text-blue-800' href='https://www.institutoanima.org.br/privacidade/' target='_blank'>neste link</a>.              
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">

                    O tempo médio para finalizar o preenchimento deste questionário é de <b>{props.duracao}</b>. As
                    questões são de preenchimento obrigatório para o consequente avanço. Não há
                    respostas certas ou erradas, o importante é que você seja sincero(a) em todo momento.                
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Em caso de dúvidas, entre em contato com:<br/>pesquisaeducacao@institutoanima.org.br   
                  </p> 

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                      Agradecemos a sua colaboração!
                  </p>  

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                      Leia atentamente os termos de aceite para participar desta pesquisa <a className='cursor-pointer underline hover:text-blue-800' onClick={handleExtra}>AQUI</a>.
                  </p>                                         

                  {/* <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Olá, <b>{props.nome}</b>. Esse questionário faz parte de uma ampla pesquisa que a {estadoLogado?.secretaria} vem realizando para assegurar a continuidade de ações que poderão impactar positivamente a educação pública no estado. As perguntas serão sobre você, seus hábitos e suas perspectivas em relação à sua escola. Não há respostas certas ou erradas, mas é fundamental que você responda com seriedade e sinceridade.
                  </p>
                  
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Vale dizer que se trata de um <b>questionário anônimo</b> - {props.tipo === "aluno" ? 'sua família, seus amigos, colegas e professores da escola' : 'alunos, colegas, e gestores da escola ou da secretaria de educação'} não saberão de nada do que você responder aqui – e <b>suas respostas não terão nenhum efeito {props.tipo === "aluno" ? 'nas suas notas ou no seu desempenho escolar' : 'na sua carreira'}</b>.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    A participação nesta avaliação é voluntária, porém sua contribuição é muito <b>importante</b> para que juntos possamos avançar rumo a um futuro melhor para você e outros jovens do nosso estado.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    O conteúdo desta pesquisa subsidiará ações internas da {estadoLogado?.secretariaAbrebiado} e os dados pessoais fornecidos serão tratados com segurança, conforme a Lei Geral de Proteção de Dados (LGPD) e demais Leis de proteção de dados aplicáveis;
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    O tempo médio para finalizar o preenchimento desse questionário é de <b>{props.duracao}</b>. As questões são de preenchimento obrigatório para o consequente avanço. <b>Não há respostas certas ou erradas</b>, o importante é que seja sincero(a) em todo momento.
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Obrigado!
                  </p> */}
                </>
              }

              {props.tipo === 'professor' && props.formularioId === 13 &&
                <>
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Olá, <b>{props.nome}</b>
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Você está sendo convidado(a) a participar de uma pesquisa sobre Educação Financeira no âmbito do Acordo de Cooperação entre a {estadoLogado?.secretaria} e o Instituto Ânima (CNPJ – 07.749.605/0003-90).
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    A pesquisa tem como objetivo mapear os conhecimentos, as competências, os desafios e as oportunidades relacionadas à implementação das práticas de Educação Financeira na rede de educação mineira. As perguntas incluem o mapeamento de informações sobre seu perfil, como dados pessoais, sua atuação docente e suas percepções relacionadas às práticas pedagógicas com foco em Educação Financeira.            
                  </p>       

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Ao responder, considere exclusivamente seu vínculo na Rede Estadual, independentemente de você possuir vínculos ou experiências em outras redes.                
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    As respostas desse formulário não serão divulgadas nominalmente, ou seja, estudantes, outros funcionários da escola e profissionais da Secretaria não terão acesso às informações nominais, somente às informações agregadas e/ou anonimizadas. 
                  </p>  

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Os dados pessoais fornecidos serão tratados com segurança, conforme a Lei Geral de Proteção de Dados (LGPD) e demais leis de proteção de dados aplicáveis. Confira, na íntegra, o nosso aviso externo de privacidade <a className='cursor-pointer underline hover:text-blue-800' href='https://www.institutoanima.org.br/privacidade/' target='_blank'>neste link</a>.
                  </p>                                     


                  <p className="text-base leading-relaxed text-gray-500 text-justify">

                    O tempo médio para finalizar o preenchimento deste questionário é de 20 a 30 minutos. Não há
                    respostas certas ou erradas, o importante é que você seja sincero(a) em todo momento.                
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Em caso de dúvidas, entre em contato com:<br/>pesquisaeducacao@institutoanima.org.br   
                  </p> 

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                      Agradecemos a sua colaboração!
                  </p>  

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                      Leia atentamente os termos de aceite para participar desta pesquisa <a className='cursor-pointer underline hover:text-blue-800' onClick={handleExtra}>AQUI</a>.
                  </p>                                         

                </>
              }              

              {props.tipo === 'aluno' && props.formularioId === 11 &&
                <>
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Olá, <b>{props.nome}</b>
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Você está sendo convidado(a) a informar sobre o seu interesse em receber vídeos com conteúdos de educação financeira no âmbito do Acordo de Cooperação entre a {estadoLogado?.secretaria} e o Instituto Ânima (CNPJ – 07.749.605/0003-90).
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Este formulário tem como objetivo informar o seu interesse em receber vídeos de Educação Financeira por WhatsApp com conteúdos que podem te ajudar a tomar decisões mais conscientes sobre hábitos de consumo. As perguntas dizem respeito a você: seus hábitos, opiniões, experiências escolares e perspectivas sobre o uso do dinheiro. Por isso, é essencial que você responda com seriedade e sinceridade.  
                  </p>       

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Vale lembrar que este é um formulário anônimo – ninguém da sua escola, sua família ou seus colegas terá acesso às suas respostas. Além disso, suas respostas não influenciam suas notas nem seu desempenho escolar.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Os dados pessoais fornecidos serão tratados com segurança, conforme a Lei Geral de Proteção de Dados (LGPD) e demais leis de proteção de dados aplicáveis. Confira, na íntegra, o nosso aviso externo de privacidade <a className='cursor-pointer underline hover:text-blue-800' href='https://www.institutoanima.org.br/privacidade/' target='_blank'>neste link</a>.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    O tempo médio para finalizar o preenchimento deste questionário é de <b>15 a 20 minutos</b>. Não há respostas certas ou erradas, o importante é que você seja sincero(a) em todo momento.  
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Em caso de dúvidas, entre em contato com:<br/>edufin.estudantes@institutoanima.org.br 
                  </p> 

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Agradecemos a sua colaboração!
                  </p>  

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                      Leia atentamente os termos de aceite para participar desta pesquisa <a className='cursor-pointer underline hover:text-blue-800' onClick={handleExtra}>AQUI</a>.
                  </p>                  
                </>
              }    

              {props.tipo === 'aluno' && props.formularioId === 12 &&
                <>
                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Olá, <b>{props.nome}</b>
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Você está sendo convidado(a) a participar de uma pesquisa sobre Educação Financeira no âmbito do Acordo de Cooperação entre a {estadoLogado?.secretaria} e o Instituto Ânima (CNPJ – 07.749.605/0003-90).                     
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    A pesquisa tem como objetivo coletar insumos sobre a temática de Educação Financeira. As perguntas serão sobre você, seus hábitos e suas perspectivas em relação à escola. É fundamental que você responda com seriedade todo o questionário.                      
                  </p>       

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    As respostas desse formulário não serão divulgadas nominalmente, ou seja, ninguém da sua escola, sua família ou seus colegas terá acesso às informações concedidas por você. Além disso, suas respostas não influenciam suas notas nem seu desempenho escolar.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Os dados pessoais fornecidos serão tratados com segurança, conforme a Lei Geral de Proteção de Dados (LGPD) e demais leis de proteção de dados aplicáveis. Confira, na íntegra, o nosso aviso externo de privacidade <a className='cursor-pointer underline hover:text-blue-800' href='https://www.institutoanima.org.br/privacidade/' target='_blank'>neste link</a>.
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    O tempo médio para finalizar o preenchimento deste questionário é de <b>20 a 30 minutos</b>. Não há respostas certas ou erradas, o importante é que você seja sincero(a) em todo momento.  
                  </p>

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Em caso de dúvidas, entre em contato com:<br/>pesquisaeducacao@institutoanima.org.br   
                  </p> 

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                    Agradecemos a sua colaboração!
                  </p>  

                  <p className="text-base leading-relaxed text-gray-500 text-justify">
                      Leia atentamente os termos de aceite para participar desta pesquisa <a className='cursor-pointer underline hover:text-blue-800' onClick={handleExtra}>AQUI</a>.
                  </p>                  
                </>
              }                        
            </div>
          }
          {passo === 2 && !extra &&
            <div className="space-y-6">

              {/* <p className="text-base leading-relaxed text-gray-500 text-justify">
                Este questionário é resultado da parceria entre a {estadoLogado?.secretaria} ({estadoLogado?.secretariaAbrebiado}) e o Instituto Ânima. Esse é um ponto de coleta de dado pessoal. Para mais informações, <a className='cursor-pointer underline hover:text-blue-800' onClick={handleExtra}>clique aqui.</a>
              </p> */}
              <p className="text-base leading-relaxed text-gray-500 text-justify">
                Assinale abaixo se você concorda em participar da pesquisa:
              </p>
            </div>
          }
          {
            extra &&
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 text-justify">Ao aceitar participar desta pesquisa você declara estar ciente que:</p>
              <ul>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Você pode interromper sua participação na pesquisa a qualquer momento, sem que isso gere qualquer prejuízo para você. </p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Os dados e as informações coletadas serão gerenciados pelo INSTITUTO ÂNIMA (CNPJ – 07.749.605/0003-90) no âmbito do Acordo de Cooperação assinado com a {estadoLogado?.secretaria};</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	As informações obtidas através da sua participação não permitirão a identificação da sua pessoa, exceto para a equipe de pesquisa, e a divulgação das mencionadas informações agregadas e/ou anonimizadas só será feita entre as instituições, profissionais e parceiros do estudo;</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Você tem direito de solicitar acesso, retificação ou eliminação dos seus Dados Pessoais, ou revogar o seu consentimento, sem que isso lhe traga qualquer penalidade ou prejuízo.</p></li>
              </ul>
              {/* <p className="text-base leading-relaxed text-gray-500 text-justify">“Este questionário é resultado da parceria entre a {estadoLogado?.secretaria} ({estadoLogado?.secretariaAbrebiado})  e o Instituto Ânima. Esse é um ponto de coleta de dado pessoal. Os dados pessoais são usados pelo INSTITUTO ÂNIMA SOCIESC DE INOVAÇÃO, PESQUISA E CULTURA (CNPJ – 07.749.605/0003-90) para o cumprimento de metas e objetivos no Acordo de Cooperação Técnica assinado com a {estadoLogado?.secretariaAbrebiado}, além de serem usados para enriquecer a sua experiência ao utilizar os nossos serviços. Confira, na íntegra, o nosso aviso externo de privacidade <a className='cursor-pointer underline hover:text-blue-800' href='https://www.institutoanimaeducacao.org.br/privacidade/' target='_blank'>neste link.</a></p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">Sempre que quiser, poderá pedir mais informações por meio do contato da Encarregada de Dados (DPO) do Instituto Ânima (privacidade@institutoanimaeducacao.org.br), Paula Starling.</p>
              <p className="text-base leading-relaxed text-gray-500 text-justify">Serão coletados neste questionário alguns dados pessoais como gênero, cor ou raça, idade e características do seu domicílio. Além disso, perguntamos sobre suas opiniões, atitudes, comportamentos, hábitos e algumas características da sua personalidade. Ao aceitar participar desta pesquisa você declara estar ciente que:</p>
              <ul>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Os Dados Pessoais fornecidos serão tratados com segurança, conforme a LGPD e com as demais Leis de Proteção de Dados Aplicáveis;</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	As informações obtidas através da sua participação não permitirão a identificação da sua pessoa, exceto para a equipe de pesquisa, e a divulgação das mencionadas informações agregadas e/ou anonimizadas só será feita entre as instituições, profissionais e parceiros do estudo;</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Você tem direito de solicitar acesso, retificação ou eliminação dos seus Dados Pessoais, ou revogar o seu consentimento, sem que isso lhe traga qualquer penalidade ou prejuízo.</p></li>
                <li><p className="text-base leading-relaxed text-gray-500 text-justify pl-8 pb-2">•	Os dados agregados (e apenas os agregados) serão divulgados para a Rede de Ensino.”</p></li>
              </ul> */}

            </div>
          }

        </Modal.Body>
        <Modal.Footer>
          <div className='flex flex-col w-full items-center justify-center'>
          {passo === 2 && !extra &&
            
              <div className='flex md:flex-row flex-col justify-between w-full gap-2 pb-8'>

                <button onClick={() => props.handleAccept(true)} className='flex justify-center items-center md:w-[50%] w-full text-white rounded-md p-1 h-24 bg-green-500 transition duration-300 ease-in-out hover:bg-green-700'>
                  {props.isLoading && <LoadImage />}
                  {!props.isLoading && "Eu declaro que entendi os objetivos, riscos e benefícios da participação nesta pesquisa, e que concordo em participar."}
                </button>

                <button color="gray" onClick={() => props.handleAccept(false)} className='md:w-[50%] w-full text-white rounded-md p-1 h-24 bg-red-500 transition duration-300 ease-in-out hover:bg-red-700'>
                  Eu não concordo em participar desta pesquisa.
                </button>

              </div>

          }
          {extra &&

              <div className='flex md:flex-row flex-col justify-between w-full gap-2'>

                <button onClick={handleExtra} className='flex justify-center items-center w-full text-white rounded-md p-1 h-12 bg-green-500 transition duration-300 ease-in-out hover:bg-green-700'>
                  Voltar
                </button>

              </div>
            
          }
          <div className='flex flex-row justify-between items-center pt-2 p-4 w-full'>
            <div>{passo > 1 && !extra && <button onClick={() => setPasso(passo - 1)} className='flex flex-row justify-between items-center text-blue-800'><ArrowBigLeft />Anterior</button>}</div>
            <div>{passo < 2 && !extra && <button onClick={() => setPasso(passo + 1)} className='flex flex-row justify-between items-center text-blue-800'>Próximo <ArrowBigRight /></button>}</div>
          </div> 

          </div>        
        </Modal.Footer>   
      </Modal>
    </>
  )
}


