'use client'
import { useState } from "react";
import { Table } from "flowbite-react"
import Image from 'next/image'
import defaultImage from '../../../assets/default.png'
import upImage from '../../../assets/up_arrow.png'
import downImage from '../../../assets/down_arrow.png'
type Column = {
    label: string,
    accessor: string
}

type props = {
    columns: Column[],
    handleSorting: any
}



const TableAnimaHead = ({ columns, handleSorting }: props) => {

    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");

    const handleSortingChange = (accessor: string) => {
        const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    };

    return (
        <Table.Head>
            {columns.map(({ label, accessor, sortable, align, size }: any, index) => {

                const cl = sortable
                    ? sortField === accessor && order === "asc"
                        ? upImage
                        : sortField === accessor && order === "desc"
                            ? downImage
                            : defaultImage
                    : "";

                return <Table.HeadCell
                    key={accessor}
                    onClick={sortable ? () => handleSortingChange(accessor) : undefined}
                    className={`min-w-[50px] ${align === 'left' ? 'text-left' : 'text-right'}`}
                >
                    
                        <div className={`min-w-[50px] cursor-pointer flex flex-row ${align === 'left' ? '' : 'justify-end'}`}>
                            {label}
                            <Image
                            src={cl}
                            width={19}
                            height={19}
                            alt="ordenação"
                        />                            
                        </div>

                    
                </Table.HeadCell>
            })}

        </Table.Head>
    );
};

export default TableAnimaHead;