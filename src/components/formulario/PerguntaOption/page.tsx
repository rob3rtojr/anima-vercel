'use client'
import { AlternativaType, PerguntaType } from '../../../Types/types'

type PropsType = {
    props: PerguntaType,
    isDisabled: boolean,
    handle: (idPergunta: string, idAlternativa: string, value: string) => void,
    alternativas: AlternativaType[]
    resposta: string
}

export default function PerguntaOption(props: PropsType) {

    return (
        <div key={`div${props.props.id}`} className="pl-2">
            
            {props.props && props.alternativas.map((alternativa: AlternativaType) => {
                //let checked: boolean = alternativa.ischecked
                //if (props.isDisabled && checked) { 
                //    checked = false
                //    //props.handle(props.props.id,alternativa.id,checked)
               // }

                return (

                    <div key={alternativa.id} >
                        <div key={`d${alternativa.id}`} className={`${!props.isDisabled && 'hover:bg-gray-100'} transition-all duration-200 rounded-md p-2`}>
                        <input
                            key={`o${alternativa.id}`}
                            type="radio"
                            id={`custom-radio-${alternativa.id}`}
                            name={`opt-${props.props.id}`}
                            value={alternativa.id}
                            disabled={props.isDisabled}
                            //checked={props.resposta === alternativa.id.toString()}
                            defaultChecked={props.resposta === alternativa.id.toString()}
                            onChange={(e)=>props.handle(props.props.id,alternativa.id,e.target.value)}
                            ref={input => {
                                if (input && props.resposta === alternativa.id) input.checked = true;
                                
                              }}                              
                        />
                        <label key={`l${alternativa.id}`} className={`pl-2 cursor-pointer ${props.isDisabled && 'text-gray-400'} transition-all duration-700`} htmlFor={`custom-radio-${alternativa.id}`}>{alternativa.descricao}</label>
                        </div>
                    </div>

                );
            })}

           
        </div>
    )
}