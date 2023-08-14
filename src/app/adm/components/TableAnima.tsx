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

    return (
        <>
            <Table striped hoverable className="bg-gray-100 rounded-lg">
                <TableHead columns={columns} handleSorting={handleSorting} />
                <TableBody columns={columns} tableData={tableData} meta={meta} />
            </Table>
        </>
    );
};

export default TableAnima;