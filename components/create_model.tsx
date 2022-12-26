import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Children } from 'react';

const Create_Model = ({ title, isVisible, onClose, children }: any) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[600px] flex flex-col bg-[#343432] rounded-lg">
                <div className='flex flex-row justify-between items-center gap-2 mx-5 my-2'>
                    <h3 className='text-white'>{title}</h3>
                    <button onClick={() => onClose()}>
                        <FontAwesomeIcon icon={faXmark} color='white' />
                    </button>
                </div>
                <div className='flex flex-col m-5 gap-4'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Create_Model;