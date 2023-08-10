
type Aluno = {
    id: number,
    nome: string
}

type PropsType = {
    alunos: Aluno[],
    handleClickAluno: (id: number, nome: string) => void,
}

export default function Alunos(props: PropsType) {

    return (
        <div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 transition-all">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Alunos da Turma
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.alunos.map((aluno) => {
                        return (
                            <tr key={aluno.id} className="bg-white border-b hover:bg-gray-50" onClick={() => props.handleClickAluno(aluno.id, aluno.nome)}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {aluno.id} - {aluno.nome}
                                </th>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </div>
    )

}