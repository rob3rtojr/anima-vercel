import { PerguntaType } from "@/Types/types"
import Timer from "../Timer/page"
import Pergunta from "../Pergunta/page"

type PropsType = {
    props: PerguntaType,
    isDisabled: boolean,
    handleTimeOut: (idPergunta: string, timer: number | undefined) => void,
    handleInputText: (idPergunta: string, value: string, mascaraResposta?: string) => void,
    handleInputTextBlur: (idPergunta: string, value: string) => void,
    isVisiblePergunta?: boolean,
    isVisibleButton?: boolean,
    isVisibleCampo?: boolean,
    timer?: number,
    contador?: number,
    porcentagemTimer?: number,
    inputValue?: string,
    valorMinimo?: number,
    valorMaximo?: number,
    mascaraResposta?: string
}

export default function PerguntaText(props: PropsType) {

    return (
        <div key={`divPerguntaText${props.props.id}`} className="flex flex-col w-full" >

            {props.timer &&
                <>
                    {(props.isVisibleButton && props.props.resposta.length === 0) &&
                        <div key={`button${props.props.id}`} className="w-full flex flex-row justify-center items-center">
                            <button className="bg-blue-950 rounded text-white p-4 w-40 transition duration-300 ease-in-out hover:bg-teal-700 hover:font-bold" onClick={() => props.handleTimeOut(props.props.id, props.props.timer)}>Iniciar</button>
                        </div>}

                    {(props.isVisiblePergunta && props.props.resposta.length === 0) && (
                        <div key={`descricaopergunta1${props.props.id}`}>
                            <div><Pergunta key={`p${props.props.id}`} texto={`${props.props.descricao}`} /></div>
                        </div>

                    )}

                    {(!props.isVisiblePergunta && !props.isVisibleButton) && (
                        <div key={`descricaopergunta2${props.props.id}`}>
                            <div><Pergunta key={`p${props.props.id}`} texto={`${props.props.id} - Responda no campo abaixo:`} /></div>
                        </div>

                    )}

                    {(props.isVisibleCampo) && (

                        <input
                            key={`input1${props.props.id}`}
                            onChange={(e) => props.handleInputText(props.props.id ,e.target.value, props.props.mascaraResposta)}
                            onBlur={(e) => props.handleInputTextBlur(props.props.id, e.target.value)}
                            placeholder="Digite aqui sua resposta"
                            className="border-2 rounded-md border-blue-200 bg-white p-2"
                            type={props.props.mascaraResposta === 'number' ? 'number' : 'text'}
                            value={props.inputValue}
                        />
                    )}

                    {(!props.isVisibleCampo && !props.isVisibleButton) && <Timer key={`timer${props.props.id}`} timer={props.timer} porcentagemTimer={props.porcentagemTimer} />}
                </>
            }
            {!props.timer && props.mascaraResposta === 'number' &&
                <>
                    <div key={`descricaopergunta3${props.props.id}`}>
                        <div><Pergunta key={`p${props.props.id}`} texto={`${props.props.id} - ${props.props.descricao}`} /></div>
                    </div>
                    <input
                        key={`input2${props.props.id}`}
                        onChange={(e) => props.handleInputText(props.props.id, e.target.value, props.props.mascaraResposta)}
                        onBlur={(e) => props.handleInputTextBlur(props.props.id, e.target.value)}
                        placeholder="Digite aqui sua resposta (somente números)"
                        className="border-2 rounded-md border-blue-200 bg-white p-2"
                        type={props.props.mascaraResposta === 'number' ? 'number' : 'text'}
                        min={props.props.valorMinimo}
                        max={props.props.valorMaximo}
                        step="1"
                        value={props.inputValue}
                    />
                </>
            }
            {!props.timer && props.mascaraResposta !== 'number' &&
                <>
                    <div key={`descricaopergunta3${props.props.id}`}>
                        <div><Pergunta key={`p${props.props.id}`} texto={`${props.props.descricao}`} /></div>
                    </div>
                    <input
                        key={`input2${props.props.id}`}
                        onChange={(e) => props.handleInputText(props.props.id, e.target.value, props.props.mascaraResposta)}
                        onBlur={(e) => props.handleInputTextBlur(props.props.id, e.target.value)}
                        placeholder="Digite aqui sua resposta"
                        className="border-2 rounded-md border-blue-200 bg-white p-2"
                        type="text"
                        value={props.inputValue}
                    />
                </>
            }

        </div>
    )
}
