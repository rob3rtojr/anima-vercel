'use client'
import { AlternativaType, PerguntaType } from "../../../Types/types"

type PropsType = {
    props: PerguntaType,
    isDisabled: boolean,
    handle: (idPergunta: string, idAlternativa: string, value: boolean) => void,
    alternativas: AlternativaType[],
    resposta: string[]
}

export default function PerguntaCheckbox(props: PropsType) {

    return (
        <div key={`div${props.props.id}`} className="pl-2">
            
            {props.props && props.alternativas.map((alternativa: AlternativaType, index: number) => {
                
                const checked = props.alternativas[index].isChecked
                return (

                    <div key={alternativa.id} >
                        <div key={`d${alternativa.id}`} className={`${!props.isDisabled && 'hover:bg-gray-100'} transition-all duration-200 rounded-md p-2`}>
                        <input
                            key={`c${alternativa.id}`}
                            type="checkbox"
                            id={`custom-checkbox-${alternativa.id}`}
                            name={`chk-${props.props.id}-${alternativa.id}`}
                            value={alternativa.id}
                            disabled={props.isDisabled}
                            onChange={(e)=>props.handle(props.props.id,alternativa.id,checked)}
                            defaultChecked={checked}
                            ref={input => {
                                if (input) input.checked = checked;
                              }}                              
                        />
                        <label key={`l${alternativa.id}`} className={`pl-2 cursor-pointer ${props.isDisabled && 'text-gray-400'} transition-all duration-700`} htmlFor={`custom-checkbox-${alternativa.id}`}>{alternativa.id} - {alternativa.descricao}</label>
                        </div>
                    </div>

                );
            })
            
            }

           
        </div>
    )
}