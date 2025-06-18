"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/api"

const options = [
  {
    id: "next.js",
    nome: "Next.js",
  },
  {
    id: "sveltekit",
    nome: "SvelteKit",
  },
  {
    id: "nuxt.js",
    nome: "Nuxt.js",
  },
  {
    id: "remix",
    nome: "Remix",
  },
  {
    id: "astro",
    nome: "Astro",
  },
]

type Option = {
  id: string;
  nome: string;
};

type ComboFilterProps = {
  onSelect: (selectedOption: string) => void;
  idRota?: string;
  idFiltro?: string;
  idSelecionado?: string;
  tipo?: string;
  labelText: string;
};

export function ComboFilter(
  {
    onSelect,
    idRota,
    idFiltro,
    idSelecionado,
    tipo,
    labelText,
  }: ComboFilterProps
) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [options, setOptions] = React.useState<Option[]>([]);
  const [textFirtstOption, setTextFirtstOption] = React.useState<string>('Selecione...');

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0);

  // Atualiza largura com ResizeObserver
  React.useEffect(() => {
    if (!buttonRef.current) return;

    const updateWidth = () => {
      const width = buttonRef.current?.getBoundingClientRect().width || 0;
      setTriggerWidth(width);
    };

    // Chamada inicial
    updateWidth();

    // Observa resize do botão
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(buttonRef.current);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [idSelecionado]);

  React.useEffect(() => {

    const fetchOptions = async () => {
      try {
        setTextFirtstOption('Carregando...')
        
        let urlRota = `/${idRota}`
        if (idFiltro !== "todos")
          urlRota += `/${idFiltro}`

        if (tipo) {
          urlRota += '?tipo=' + tipo
        }

        let response: any

        if (idFiltro !== "0") {
          response = await api.get(urlRota);
          setOptions(response.data);
          setValue("")
          //console.log("aqui")
        }
        else {
          setOptions([]);
        }

        setTextFirtstOption('Selecione...')

        //setSelectedOption(idSelecionado)

      } catch (error) {
        console.log(error);
      }
    };

    if (idFiltro) {
      fetchOptions();
    } else {
      setOptions([]);
    }

  }, [idFiltro, tipo]);

  return (
    <div>
      {labelText && (
        <label
          className="block text-gray-600 mt-2 mb-1 text-sm xl:text-base"
          htmlFor="txt"
        >
          {labelText}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? options.find((option) => option.nome === value)?.nome
              : textFirtstOption}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: triggerWidth }}>
          <Command className="w-full">
            <CommandInput placeholder="Localizar..." className="w-full" />
            <CommandList className="w-full max-h-[200px] overflow-auto">
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              <CommandGroup className="w-full">
                {options.map((option) => (
                  <CommandItem
                    className="w-full"
                    key={option.id}
                    value={option.nome}
                    onSelect={(currentValue) => {
                      // Procura o item pelo nome (que é o currentValue)
                      const selected = options.find((o) => o.nome === currentValue);
                      if (selected) {
                        setValue(selected.nome); // continua exibindo o nome
                        setOpen(false);
                        onSelect?.(selected.id); // aqui você envia o ID correto
                        //console.log("ID selecionado:", selected.id);
                      }
                    }}
                  >
                    {option.nome}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
