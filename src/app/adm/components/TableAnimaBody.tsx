
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
    let pct: number
    let abs = 0    
    return (
        <Table.Body className='divide-y'>
            {tableData.map((data, index) => {
                return (
                    <Table.Row key={index}>
                        {columns.map(({ accessor, align, size }: any) => {
                            let isValue = false
                            let campoTotal: any = 'total'
                            let descCampo: any = ''
                            let corCampo: string = ''
                            switch (accessor) {
                                case "nao_iniciado":
                                case "recusado":
                                case "iniciado":
                                case "finalizado":
                                    descCampo = `_${accessor}_abs`
                                    isValue = true
                                    pct =  parseFloat(data[accessor])
                                    abs = parseInt(data[descCampo])

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
                                {isValue && accessor!=="total" &&
                                <>
                                <span className={`pr-1 font-bold ${accessor === 'finalizado' ? corCampo : ''} `}>{`${pct}%`}</span>
                                <Divider />
                                </>
                                }
                                {isValue &&
                                    
                                    <span  className='ml-1 text-xs'>{abs}</span>
                                }
                                {!isValue &&
                                    <span  className='ml-1 text-xs'>{tData}</span>
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