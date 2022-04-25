import React from 'react';
import App from './App'

const MainApp = () => {

    const [tool, setTool] = React.useState('pen')

    return (
        <div className={`h-screen md:w-32 lg:w-48 flex overflow-y-hidden overflow-x-hidden`}>
            <div className={`w-16  bg-white shadow-default py-2 px-2`}>
                <ul >
                    <li onClick={() => setTool('pen')} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bx-pen'></i></li>
                    <li onClick={() => setTool('eraser')} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bxs-eraser'></i></li>
                </ul>
            </div>
            <div className={`w-full bg-cyan-800 py-10 px-10`}>
                <div className={`w-full h-full bg-white`}>
                    <App 
                        tool = {tool}
                    />
                </div>
            </div>
        </div>
    )
}

export default MainApp
