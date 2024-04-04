import { PerguntaType } from "@/Types/types"

type PropsType = {
    pergunta: PerguntaType,
    resposta: string|null,
    limpar: (id: string)=>void
}

export default function DebubArea({pergunta, resposta, limpar}: PropsType) {
    return(
        
            <span className='flex flex-col bg-slate-300 p-4'>
            {`Resposta: ${resposta}`} 
            <button className='bg-slate-400 text-black rounded-lg' onClick={() => limpar(pergunta.id)}>Limpar Seleção</button>
            {JSON.stringify(pergunta)}
            </span>            
        
    )
}