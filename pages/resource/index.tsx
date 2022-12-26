import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Create_Model from '../../components/create_model'
import { useState, useEffect } from 'react'
import { Column, useTable } from 'react-table'
import { faXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'



export default function Resource() {
    const [showModal, setShowModel] = useState(false)
    // const [data, setData] = useState(null)
    // const [isLoading, setLoading] = useState(false)

    const data = React.useMemo(
        () => [
            {
                col1: 'Sales',
                col2: 'sales',
            },
            {
                col1: 'Products',
                col2: 'products',
            },
            {
                col1: 'Inventory',
                col2: 'inventory',
            },
        ],
        []
    )

    const columns = React.useMemo<Column<{ col1: string, col2: string }>[]>(
        () => [
            {
                Header: 'Resource Name',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: 'Resource Key',
                accessor: 'col2',
            }
        ],
        []
    )
    const tableInstance = useTable({ columns, data })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })
    return (
        <div className=''>
            <div className='flex flex-col'>
                <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                    <h1 className='font-sans text-xl font-bold'>Resources</h1>
                    <button className='bg-black rounded-md px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                        <div className='flex flex-row justify-between items-center gap-2'>
                            <FontAwesomeIcon icon={faPlus} />
                            Create a Resource
                        </div>
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="p-5 w-full inline-block align-middle">
                            <div className='overflow-hidden border rounded-lg'>
                                <table {...getTableProps()} className='min-w-full divide-y divide-gray-200'>
                                    <thead className="bg-gray-50">
                                        {// Loop over the header rows
                                            headerGroups.map(headerGroup => (
                                                // Apply the header row props
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {// Loop over the headers in each row
                                                        headerGroup.headers.map(column => (
                                                            // Apply the header cell props
                                                            <th {...column.getHeaderProps()} className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                                {// Render the header
                                                                    column.render('Header')}
                                                            </th>
                                                        ))}
                                                    <th className="px-10 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                                                        <a className="">
                                                            Actions
                                                        </a>
                                                    </th>
                                                </tr>
                                            ))}
                                    </thead>
                                    {/* Apply the table body props */}
                                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                                        {// Loop over the table rows
                                            rows.map(row => {
                                                // Prepare the row for display
                                                prepareRow(row)
                                                return (
                                                    // Apply the row props
                                                    <tr {...row.getRowProps()}>
                                                        {// Loop over the rows cells
                                                            row.cells.map(cell => {
                                                                // Apply the cell props
                                                                return (
                                                                    <td {...cell.getCellProps()} className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                        {// Render the cell contents
                                                                            cell.render('Cell')}
                                                                    </td>
                                                                )
                                                            })}
                                                        <td className="px-10 py-4 text-right text-gray-800 whitespace-nowrap">
                                                            <button>
                                                                <FontAwesomeIcon icon={faEllipsisVertical}/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Create_Model title='Create a Resource' isVisible={showModal} onClose={() => setShowModel(false)}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Name</label>
                        <input type="text" id="name" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Key</label>
                        <input type="text" id="key" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                    </div>
                    <div className='flex flex-grow flex-row justify-end items-center'>
                        <button className='bg-yellow-500 rounded-md px-6 py-2 text-white text-xs' onClick={() => setShowModel(false)}>
                            Create
                        </button>
                    </div>
                </Create_Model>
            </div>
        </div>
    )
}
