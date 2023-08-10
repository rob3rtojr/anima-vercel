type PropsType = {
    texto: string,
    isDisabled?: boolean
}

export default function Pergunta(props: PropsType) {
    return(
        <div className={`pb-4 font-bold text-xl transition-all duration-700 ${props.isDisabled ? 'text-gray-400' : 'text-blue-900'}`}>
            {props.texto}
        </div>
    )
}