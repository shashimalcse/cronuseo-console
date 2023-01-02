import { clear } from "console"
import { useState } from "react"

export type SelectOption = {
    label: string
    value: string
}
type SelectProps = {
    options: SelectOption[]
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

const Dropdown = ({ value, onChange, options }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false)

    function clearOptions() {
        onChange(undefined)
    }

    function selectOption(option: SelectOption) {
        onChange(option)
    }

    function isOptionSelected(option: SelectOption) {
        return option === value
    }

    return (
        <div className="flex flex-col bg-gray-600 border text-sm text-white outline-none rounded hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500">
            <div className="flex flex-row h-min-8 p-2" onClick={() => setIsOpen(prev => !prev)}>
                <div className="grow">{value?.label}</div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <button className="" onClick={(e) => {
                            e.stopPropagation()
                            clearOptions()
                        }
                        }>&times;</button>
                        <div className=" bg-white self-stretch w-[1px]"></div>
                        <div className="mt-1 border-t-white border-4 border-solid border-transparent"></div>
                    </div>
                </div>
            </div>
            <div className={isOpen ? "" : "hidden"}>
                <hr className="p-0" />
                <div className="bg-gray-600 list-none max-h-60 overflow-y-auto p-2">
                    <ul className="">
                        {
                            options.map(option => (
                                <li key={option.value}
                                    onClick={e => {
                                        e.stopPropagation()
                                        selectOption(option)
                                        setIsOpen(false)
                                    }} 
                                    className={`pt-2 ${isOptionSelected(option) ? "bg-yellow-500" : ""}`} >{option.label}</li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dropdown;