import { useEffect, useState } from "react"

type RadioTesteProps = {
    perguntaId: string,
    handleChange: (perguntaId: string, valor: string) => void,
    lista: ItemType[],
    disabled: boolean,
    selectedItem: string
}

type ItemType = {
    id: string,
    descricao: string
}

export default function PerguntaRadio(props: RadioTesteProps) {

    return (
        <div className="">
            {
                props.lista.map((i) => {


                    return (
                        <div key={i.id} className="flex items-center">
                            {props.perguntaId} - {i.id} :
                            <div className={`flex flex-row items-center gap-2 ${i.id==="0" ? 'hidden': 'block'}`}>
                                <input
                                    type="radio"
                                    id={i.id}
                                    name={`perguntaRadio-${props.perguntaId}`}
                                    disabled={props.disabled}
                                    value={i.id}
                                    ref={input => {
                                        if (input) input.checked = props.selectedItem === input.value;
                                    }}  
                                    onChange={(e) => {
                                        props.handleChange(props.perguntaId, e.target.value);

                                    }}
                                />
                                <span>{i.descricao}</span>
                            </div>
                        </div>
                    )
                })
            }
            

            <span>Resposta: {props.selectedItem}</span>
        </div>
    )
}