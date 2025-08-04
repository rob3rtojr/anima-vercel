type AlternativaType = {
    id: string,
    descricao: string,
    isChecked: boolean,
    valor: string,
    checkRespostaUnica?: string
}

type EscutarType = {
    escutarPerguntaId: string,
    escutarAlternativaId: string
}

type PerguntaType = {
    id: string,
    descricao:string,
    descricaoAuxiliar?: string,
    numero: string,
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
    sequencia?:number,
    identificador?:string,
    somatorioResposta?: number
}

export type { AlternativaType, EscutarType, PerguntaType };