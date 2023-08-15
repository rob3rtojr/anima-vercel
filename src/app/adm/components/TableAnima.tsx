'use client'
import TableBody from "./TableAnimaBody";
import TableHead from "./TableAnimaHead";
import { useSortableTable } from "./useSortableTable";
import { Table } from 'flowbite-react';

type Props = {
    data: any
    columns: any
    meta: number
}



const TableAnima = ({ data, columns, meta }: Props) => {

    const [tableData, handleSorting] = useSortableTable(data, columns);
    let pct: any
    let abs: any
    let descCampo: any
    let totalGeral: number

    totalGeral = tableData.reduce(function (previous: number, current: any) {
        return previous + current.total;
    }, 0)

    return (



        <>
            <Table striped hoverable className="bg-gray-100 rounded-lg mb-4">
                <TableHead columns={columns} handleSorting={handleSorting} />
                <TableBody columns={columns} tableData={tableData} meta={meta} />
                <tfoot className="rounded-lg">
                    <tr className="h-9 bg-gray-300">
                        {columns.map((c: any, index: number) => {
                            abs = 0
                            switch (c.accessor) {
                                case "nao_iniciado":
                                    abs = tableData.reduce(function (previous: number, current: any) {
                                        return previous + current._nao_iniciado_abs;
                                    }, 0)

                                    pct = ((abs * 100) / totalGeral).toFixed(2)

                                    break;
                                case "recusado":
                                    abs = tableData.reduce(function (previous: number, current: any) {
                                        return previous + current._recusado_abs;
                                    }, 0)

                                    pct = ((abs * 100) / totalGeral).toFixed(2)

                                    break;
                                case "iniciado":
                                    abs = tableData.reduce(function (previous: number, current: any) {
                                        return previous + current._iniciado_abs;
                                    }, 0)

                                    pct = ((abs * 100) / totalGeral).toFixed(2)

                                    break;
                                case "finalizado":

                                    abs = tableData.reduce(function (previous: number, current: any) {
                                        return previous + current._finalizado_abs;
                                    }, 0)

                                    pct = ((abs * 100) / totalGeral).toFixed(2)

                                    break;
                                case "total":

                                    abs = tableData.reduce(function (previous: number, current: any) {
                                        return previous + current.total;
                                    }, 0)


                                default:
                                    break;
                            }

                            return (
                                <>
                                    <td
                                        className={`${c.align === "left" ? 'text-left pl-4' : 'text-right'}  font-bold pr-4`}
                                        key={`footer-${index}`}>
                                            {c.align==="left" && ''}
                                            {c.accessor === "total" && abs}
                                            {index===0 && "TOTAL"}
                                            {index > 0 && c.align==='rigth' && c.accessor !== "total" ? `${pct}% | ${abs}` : ""}
                                    </td>
                                </>
                            )
                        })}
                    </tr>
                </tfoot>
            </Table>
        </>
    );
};

export default TableAnima;