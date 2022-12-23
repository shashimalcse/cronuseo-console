
const Create_Model = ({title, isVisible, onClose}:any) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[600px] flex flex-col">
                <button onClick={()=> onClose()}>Close</button>
            </div>
        </div>
    )
}

export default Create_Model;