import React, { useState, useEffect } from 'react';
import { api } from "@/lib/api"

type Option = {
  id: number;
  nome: string;
};

type ComboProps = {
  onSelect: (selectedOption: string) => void;
  idRota: string
  idFiltro: string
  idSelecionado: string
  labelText: string
};

const Combo: React.FC<ComboProps> = ({ onSelect, idRota, idFiltro, idSelecionado, labelText }) => {

  const [options, setOptions] = useState<Option[]>([]);
  const [textFirtstOption, setTextFirtstOption] = useState<string>('Selecione...');
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    
    const fetchOptions = async () => {
      try {
        setTextFirtstOption('Carregando...')

        let urlRota = `/${idRota}`
        if (idFiltro !== "todos")
          urlRota += `/${idFiltro}`
        
        const response = await api.get(urlRota);

        setOptions(response.data);
        setTextFirtstOption('Selecione...')
        setSelectedOption(idSelecionado)

      } catch (error) {
        console.log(error);
      }
    };

    if (idFiltro) {
        fetchOptions();
      } else {
        setOptions([]);
      }    

  }, [idFiltro]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div>
        {labelText && (
          <label
            className="block text-gray-600  mb-1 text-sm xl:text-base"
            htmlFor="txt"
          >
            {labelText}
          </label>
        )}        
    <select className='border border-slate-400 disabled:border-slate-100 w-full block outline-none py-1 px-1 transition-all text-xs lg:text-sm xl:text-base mb-1 md:mb-4 bg-slate-50 focus:shadow focus:shadow-blue-500 rounded-md' value={selectedOption} onChange={handleChange}>
      <option value="0">{textFirtstOption}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.nome}
        </option>
      ))}
    </select>
    </div>
  );
};

export default Combo;