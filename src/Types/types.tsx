type AlternativaType = {
    id: string,
    descricao: string,
    isChecked: boolean
}

type EscutarType = {
    escutarPerguntaId: string,
    escutarAlternativaId: string
}

type PerguntaType = {
    id: string,
    descricao:string,
    numero:string,
    ordem:number,
    tipoPerguntaId: number,
    timer?: number,
    valorMinimo?:number,
    valorMaximo?:number,
    step?:number
    mascaraResposta?:string,
    escutar: EscutarType[],
    formularioId: number,
    alternativa: AlternativaType[],
    resposta:string[],
    contador:number,
    porcentagemTimer?:number,
    isVisiblePergunta?: boolean,
    isVisibleButton?: boolean,
    isVisibleCampo?: boolean,
    isDisabled:boolean,
    respostaBanco:string[],
    bloco?: number,
    sequencia?:number
}

export type { AlternativaType, EscutarType, PerguntaType };