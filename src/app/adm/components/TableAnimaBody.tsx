
import { Table } from 'flowbite-react';
import Divider from './Divider';

type Column = {
    label: string,
    accessor: string
    size: string
}

type props = {
    tableData: string[],
    columns: Column[],
    meta: number
}
const TableAnimaBody = ({ tableData, columns, meta }: props) => {
    return (
        <Table.Body className='divide-y'>
            {tableData.map((data, index) => {
                return (
                    <Table.Row key={index}>
                        {columns.map(({ accessor, align, size }: any) => {
                            let pct = 0
                            let isValue = false
                            let campoTotal: any = 'total'
                            let corCampo: string = ''
                            switch (accessor) {
                                case "nao_iniciado":
                                case "recusado":
                                case "iniciado":
                                case "finalizado":
                                    isValue = true
                                    pct = (parseInt(data[accessor]) * 100) / parseInt(data[campoTotal])

                                    if (pct === 0) {
                                        corCampo = 'bg-red-200'
                                    } else if (pct >= meta) {
                                        corCampo = 'bg-green-200'
                                    } else if (pct < meta) {
                                        corCampo = 'bg-gray-200'
                                    }

                                    break;

                                default:
                                    break;
                            }


                            //(((r[1] * 100) / Total)).toFixed(2)
                            const tData = data[accessor] ? data[accessor] : "——";
                            return <Table.Cell
                                key={accessor}
                                className={`w-[${size}%] ${align === 'left' ? 'text-left' : 'text-right'}`}>
                                <span className='pr-1 text-xs'>{tData} </span>
                                {isValue && <>
                                    <Divider />
                                    <span className={`ml-1 font-bold ${accessor === 'finalizado' ? corCampo : ''} `}>{`${pct.toFixed(2)}%`}</span>
                                </>

                                }
                            </Table.Cell>;
                        })}
                    </Table.Row>
                );
            })}
        </Table.Body>
    );
};

export default TableAnimaBody;