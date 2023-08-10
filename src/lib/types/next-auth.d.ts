import NextAuth from "next-auth";

type Formulario = {
  id: number,
  nome: string,
  tipo: string
}

type FormularioUsuario = {
  isLoading: boolean, 
  pessoaId: number,
  situacao: number,
  formulario: Formulario
}

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      nome: string;
      role: string;
      siglaEstado: string;
      formularios: FormularioUsuario[];
      accessToken: string;
    };
  }
}
