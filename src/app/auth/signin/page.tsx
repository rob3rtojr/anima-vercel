"use client";

import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from "next-auth/react";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/elements/Button";
import TextBox from "@/components/elements/TextBox";
import Combo from '@/components/elements/Combo';
import { api } from '@/lib/api';
import { ToastContainer, toast } from 'react-toastify';
import AjudaModal from '../../../components/AjudaModal'
import { CircleHelpIcon } from 'lucide-react';
import { ComboFilter } from '@/components/elements/ComboFilter';

type PropsType = {
  siglaEstado: string
  isAuth: boolean
}
type EstadoProps = {
  id: number;
  nome: string;
  sigla: string;
};

type Aluno = {
  id: number;
  nome: string;
};

type Formulario = {
  id: number;
  nome: string;
  tipo: string;
};

function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messageError, setMessageError] = useState<string | null>(searchParams.get("error"))

  const [estado, setEstado] = useState<EstadoProps>({ id: 0, nome: "", sigla: "" });

  //const [estadoId, setEstadoId] = useState<string>("0");
  const [municipioId, setMunicipioId] = useState<string>("0");
  const [professorId, setProfessorId] = useState<string>("0");
  const [escolaId, setEscolaId] = useState<string>("0");
  const [turmaId, setTurmaId] = useState<string>("0");
  const [alunoId, setAlunoId] = useState<string>("0");
  //const [aluno, setAluno] = useState<Aluno | undefined>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authType, setAuthType] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [authMessage, setAuthMessage] = useState<string>();
  const [placeHolderText, setPlaceHolderText] = useState<string>();
  const [isAjudaOpen, setIsAjudaOpen] = useState<boolean>(false);

  const password = useRef("");

  const onSubmit = async (event: SyntheticEvent) => {

    event.preventDefault()

    setIsLoading(true)
    setMessageError("")

    let id = ""
    let dataNascimento = ""
    let nomeMae = ""
    let matricula = ""
    let cpf = ""
    let masp = ""
    let matriculaProfessor = ""
    let email = ""
    let celular = ""

    userType === "aluno" ? id = alunoId : id = professorId

    switch (authType) {
      case "data":
        dataNascimento = password.current.trim();
        break;
      case "mae":
        nomeMae = password.current.trim();
        break;
      case "matricula":
        matricula = password.current.trim();
        break;
      case "cpf":
        cpf = password.current.trim();
        break;
      case "masp":
        masp = password.current.trim();
        break;
      case "matriculaprofessor":
        matriculaProfessor = password.current.trim();
        break;
      case "email":
        email = password.current.trim();
        break;
      case "celular":
        celular = password.current.trim();
        break;
      default:
        id = ""
        dataNascimento = ""
        nomeMae = ""
        matricula = ""
        cpf = ""
        masp = ""
        matriculaProfessor = ""
        email=""
        celular=""
        break;
    }

    const result = await signIn("credentials", {
      id: id,
      dataNascimento,
      nomeMae,
      matricula,
      cpf,
      masp,
      matriculaProfessor,
      email,
      celular,
      userType,
      //redirect: true,
      //callbackUrl: "/user/listaFormularios",
      redirect: false

    });

    if (result?.error) {
      setMessageError(result.error)
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }

    setIsAuthenticated(true)
    router.replace('/user/listaFormularios')


  }

  useEffect(() => {

    searchParams.get("estado") === 'SP' ? setUserType('professor') : setUserType('aluno')
    
    const fetchOptions = async () => {
      try {

        const result = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/estados/${searchParams.get("estado")}`)

        const { id, sigla, nome } = result.data

        setEstado({ id, sigla, nome });

      } catch (error) {
        toast.error(`Ocorreu um erro! Tente novamente.`)
      }
    };

    if (!searchParams.get("estado")) {
      router.push("/")
    } else {

      // Obtém a data atual
      const dataAtual = new Date();

      // Define a data limite
      const dataLimite = new Date(`${process.env.NEXT_PUBLIC_LIMIT_DATE}`);

      // Compara as datas
      if (dataAtual < dataLimite) {
        // Coloque o trecho de código que você quer executar aqui
        fetchOptions();
      } else {
        router.push("/")
      }
    }



  }, [searchParams.get("estado")])


  useEffect(() => {

    setAlunos([])
    //setAluno(undefined)

    const fetchAlunos = async () => {
      try {
        const response = await api.get(`/alunos/${turmaId}`);

        if (response.data.length > 0) {

          let alunosTemp = alunos
          response.data.map(({ id, nome }: Aluno) => {
            setAlunos(oldArray => [...oldArray, { id, nome }]);
          })

        } else {
          setAlunos([])
        }

      } catch (error) {
        toast.error(`Ocorreu um erro! Tente novamente.`)
      }
    };

    fetchAlunos()

  }, [turmaId])

  useEffect(() => {

    setAuthMessage("")
    messageAuthType("")

    setMessageError("")

  }, [userType])

  const handleUserType = (type: string) => {
    //setEstadoId("all")
    setUserType(type)
  }


  // const handleSelectRegional = (selectedOption: string) => {
  //   setRegionalId(selectedOption)
  //   setMunicipioId("0")
  //   setEscolaId("0")
  //   setTurmaId("0")
  // };

  const handleSelectMunicipio = (selectedOption: string) => {
    //console.log("handleSelectMunicipio")
    setMunicipioId(selectedOption)
    setProfessorId("0")
    setEscolaId("0")
    setTurmaId("0")
  };

  const handleSelectProfessor = (selectedOption: string) => {
    setProfessorId(selectedOption)
    setEscolaId("0")
    setTurmaId("0")
    setAlunoId("0")
  };

  const handleSelectEscola = (selectedOption: string) => {
    setEscolaId(selectedOption)
    setTurmaId("0")
  };

  const handleSelectTurma = (selectedOption: string) => {
    setTurmaId(selectedOption)
  };

  const handleSelectAluno = (selectedOption: string) => {
    setAlunoId(selectedOption)
  };

  function messageAuthType(type: string) {

    let aux = ""
    setAuthType(type)
    setMessageError("")


    switch (type) {
      case "data":
        setAuthMessage(`Informe a data de nascimento (dd/mm/aaaa)`)
        setPlaceHolderText('dd/mm/aaaa')
        break;
      case "matricula":
        setAuthMessage(`Informe a matrícula`)
        setPlaceHolderText('')
        break;
      case "mae":
        setAuthMessage(`Informe o primeiro nome da mãe`)
        setPlaceHolderText('')
        break;
      case "cpf":
        setAuthMessage(`Informe o CPF`)
        setPlaceHolderText('000.000.000-00')
        break;
      case "masp":
        setAuthMessage(`Informe a MASP (com dígito)`)
        setPlaceHolderText('')
        break;
      case "matriculaprofessor":
        setAuthMessage(`Informe a matrícula/vínculo servidor`)
        setPlaceHolderText('')
        break;
      case "email":
        setAuthMessage(`Informe o email`)
        setPlaceHolderText('exemplo@gmail.com')
        break;
      case "celular":
        setAuthMessage(`Informe o número do celular`)
        setPlaceHolderText('Somente números. Exemplo: 1199997788')
        break;
      default:
        setAuthMessage("")
        setPlaceHolderText('')
        break;
    }

  }

  const handleAuthType = (type: string) => {

    messageAuthType(type)

  }



  return (
    <div className={"flex flex-row justify-center items-center h-screen bg-slate-800 gap-1"}>

      {/* {!isAuthenticated && */}

      <div className="px-7 py-4 shadow bg-gray-100 rounded-md flex flex-col gap-2 justify-between w-[500px]">
        {/* <div className="flex flex-row justify-start"> */}
        <div>
          <div className='flex flex-row items-center pr-4 gap-2'><input type="radio" name="optUser" onChange={(e) => handleUserType(e.target.value)} value="aluno" ref={input => { if (input && userType === "aluno") input.checked = true; }} /> Sou estudante da rede</div>
          <div className='flex flex-row items-center gap-2'><input type="radio" name="optUser" onChange={(e) => handleUserType(e.target.value)} value="professor" ref={input => { if (input && userType === "professor") input.checked = true; }} /> Sou profissional da educação</div>
        </div>
        <div className='flex flex-1 flex-col pr-2'>
          <ComboFilter  labelText='Município da escola' idRota="municipios-por-estado" onSelect={handleSelectMunicipio} idFiltro={estado.id.toString()} idSelecionado={municipioId} tipo={userType}/>
          {/* <Combo labelText='Município' idRota="municipios-por-estado" onSelect={handleSelectMunicipio} idFiltro={estado.id.toString()} idSelecionado={municipioId} tipo={userType} /> */}

          {userType === "professor" &&
            // <Combo labelText='Servidores' idRota="professores" onSelect={handleSelectProfessor} idFiltro={municipioId} idSelecionado={professorId} tipo={userType}/>
            <ComboFilter  labelText='Servidores' idRota="professores" onSelect={handleSelectProfessor} idFiltro={municipioId} idSelecionado={professorId} tipo={userType}/>
          }
          {userType === "aluno" &&
            <>
              <ComboFilter  labelText='Escola' idRota="escolas" onSelect={handleSelectEscola} idFiltro={municipioId} idSelecionado={escolaId} tipo={userType}/>

              <ComboFilter  labelText='Série/Ano' idRota="turmas" onSelect={handleSelectTurma} idFiltro={escolaId} idSelecionado={turmaId} />

              <ComboFilter  labelText='Nome do estudante' labelTextAux='por exemplo João A.S. - João Aparecido Silva' idRota="alunos" onSelect={handleSelectAluno} idFiltro={turmaId} idSelecionado={alunoId} />
            </>
          }

        </div>

        <div className='flex flex-1 flex-col gap-2'>
          <label className='pb-2 pt-2'>
            Escolha UMA forma para confirmarmos sua identidade:
          </label>

          <div className="flex md:flex-row flex-col md:gap-4 gap-2 ">

            {userType === "aluno" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "data") input.checked = true; }} value="data" /> Data de Nascimento</div>}

            {userType === "aluno" && estado.sigla === "xx" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "cpf") input.checked = true; }} value="cpf" /> CPF</div>}
            {userType === "aluno" && estado.sigla === "PA" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "matricula") input.checked = true; }} value="matricula" /> Matrícula</div>}
            {userType === "aluno" &&
              <div className='flex md:flex-col flex-row justify-start items-center'>
                <div>
                  <input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "mae") input.checked = true; }} value="mae" /> Nome da mãe
                </div>
                <span>(primeiro nome)</span>
              </div>
            }
            {userType === "professor" && estado.sigla === "SP" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "email") input.checked = true; }} value="email" /> Email</div>}
            {userType === "professor" && estado.sigla === "SP" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "celular") input.checked = true; }} value="celular" /> Celular</div>}
            {userType === "professor" && estado.sigla !== "SP" && estado.sigla !== "MG" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "cpf") input.checked = true; }} value="cpf" /> CPF</div>}
            {userType === "professor" && estado.sigla === "MG" && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "masp") input.checked = true; }} value="masp" /> MASP</div>}
            {userType === "professor" && estado.sigla !== "SP" && estado.sigla !== "GO" && estado.sigla !== "BA" && estado.sigla !== "MG" &&
              <div >
                <div>
                  <input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "matriculaprofessor") input.checked = true; }} value="matriculaprofessor" /> Nº de matrícula
                </div>
                {/* <span className='text-sm text-gray-500 pl-1'>(número disponível no contracheque/holerite)</span> */}
              </div>
            }
            {userType === "professor" && (estado.sigla === "GO" || estado.sigla === "PA" || estado.sigla === "MG") && <div><input type="radio" name="optAuth" onChange={(e) => handleAuthType(e.target.value)} ref={input => { if (input && authType === "data") input.checked = true; }} value="data" /> Data Nascimento</div>}
          </div>

          <TextBox
            labelText={authMessage}
            type={"text"}
            onChange={(e) => { password.current = e.target.value; setMessageError('') }}
            placeholder={placeHolderText}
            mask={authType==='data' ? '99/99/9999' : ''}
            error={messageError === "CredentialsSignin" ? 'Ops! Não conseguimos identificar o seu cadastro. Confira o dado preenchido e tente novamente ou escolha outra forma para confirmarmos sua identidade.' : ''}
          />
          <Button onClick={onSubmit} disabled={isLoading} isLoading={isLoading}>Login</Button>
          <div onClick={()=>setIsAjudaOpen(true)} className='flex flex-row items-center cursor-pointer gap-2 justify-center w-full'><CircleHelpIcon width={20}/> Precisa de ajuda?</div>

        </div>
      </div>
      <AjudaModal
          setIsModalOpen={setIsAjudaOpen}
          isModalOpen={isAjudaOpen}
          tipoAjuda={'geral'}
      />      
      <ToastContainer />
    </div>
  );
}

export default LoginPage;