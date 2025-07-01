"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Info } from "lucide-react"

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
  labelTextAux?: string;
};

export function ComboFilter({
  onSelect,
  idRota,
  idFiltro,
  idSelecionado,
  tipo,
  labelText,
  labelTextAux,
}: ComboFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [options, setOptions] = React.useState<Option[]>([])
  const [textFirtstOption, setTextFirtstOption] = React.useState('Selecione...')
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = React.useState(0)

  React.useEffect(() => {
    if (!buttonRef.current) return
    const updateWidth = () => {
      const width = buttonRef.current?.getBoundingClientRect().width || 0
      setTriggerWidth(width)
    }
    updateWidth()
    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(buttonRef.current)
    return () => resizeObserver.disconnect()
  }, [idSelecionado])

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        setTextFirtstOption('Carregando...')
        let urlRota = `/${idRota}`
        if (idFiltro !== "todos") urlRota += `/${idFiltro}`
        if (tipo) urlRota += '?tipo=' + tipo
        let response: any
        if (idFiltro !== "0") {
          response = await api.get(urlRota)
          setOptions(response.data)
          setValue("")
        } else {
          setOptions([])
        }
        setTextFirtstOption('Selecione...')
      } catch (error) {
        console.log(error)
      }
    }
    if (idFiltro) {
      fetchOptions()
    } else {
      setOptions([])
    }
  }, [idFiltro, tipo])

  function normalize(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

  const filteredOptions = options.filter(option =>
    normalize(option.nome).includes(normalize(search))
  )

  return (
    <div>
      {labelText && (
        <div className="flex flex-col pt-1">
          <label className="block text-gray-600 mt-2 text-sm xl:text-base">
            {labelText}
          </label>
          {labelTextAux && (
            <span className="text-xs text-gray-500 pb-1">({labelTextAux})</span>
          )}
        </div>
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
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Localizar..."
              className="w-full"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="w-full max-h-[200px] overflow-auto">
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              <CommandGroup className="w-full">
                {filteredOptions.map((option) => (
                  <CommandItem
                    className="w-full"
                    key={option.id}
                    value={option.nome}
                    onSelect={() => {
                      setValue(option.nome)
                      setOpen(false)
                      onSelect?.(option.id)
                    }}
                  >
                    {option.nome}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.nome ? "opacity-100" : "opacity-0"
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
