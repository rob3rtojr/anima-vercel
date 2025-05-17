'use client';

import { Modal } from 'flowbite-react';
import { CircleHelpIcon } from 'lucide-react'

type PropsType = {
  setIsModalOpen: (isModalOpen: boolean) => void,
  isModalOpen: boolean,
  tipoAjuda: string
}

export default function AjudaModal(props: PropsType) {
  
  return (
    <>
      <Modal show={props.isModalOpen} onClose={() => props.setIsModalOpen(false)}>
        <Modal.Header><div className='flex flex-row items-center gap-2'><CircleHelpIcon/> <span>Ajuda</span></div></Modal.Header>
        <Modal.Body>
            <div className='flex md:flex-row flex-col justify-between w-full gap-2'>
              {props.tipoAjuda === 'geral' && 
              <div className='flex flex-col'>
                <span className='font-bold mb-2'>Dúvidas / Dificuldades</span>
                <span className='text-justify'>Em caso de dúvidas ou dificuldades, entre em contato com o e-mail a seguir apresentando todas as informações preenchidas:<br/>pesquisaeducacao@institutoanima.org.br</span>
                <span className='font-bold mb-2 mt-4'>Autenticação</span>
                <span className='text-justify'>Caso tenha problema na autenticação, pedimos que entre em contato pelo e-mail pesquisaeducacao@institutoanima.org.br e nos informe o município, nome completo, e-mail e telefone para verificarmos se o respondente está na lista de selecionados para a pesquisa.</span>
              </div>
              }
            </div>          
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  )
}


