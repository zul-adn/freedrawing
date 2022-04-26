import React from 'react';
import App from './App';
import { Slider, RangeSlider } from 'rsuite';
import { SketchPicker, CirclePicker } from 'react-color';

import 'rsuite/styles/index.less';


const MainApp = () => {

    const Instance = (
        <div>
            <Slider
                progress
                defaultValue={50}
                onChange={value => {
                    console.log(value);
                }}
            />
            <hr />
            <RangeSlider defaultValue={[10, 50]} />
        </div>
    );

    const [tool, setTool] = React.useState('pen')
    const [color, setColor] = React.useState('#00000')
    const [width, setWidth] = React.useState(1)

    return (
        <div className={`h-screen flex overflow-y-hidden overflow-x-hidden`}>
            <div className={`w-16 bg-white shadow-default py-2 px-2 mt-10`}>
                <ul >
                    <li onClick={() => setTool('pen')} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bx-pen'></i></li>
                    <li onClick={() => setTool('eraser')} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bxs-eraser'></i></li>
                </ul>
            </div>
            <div className={`w-4/5 flex bg-cyan-800 py-5 px-5 `}>
                <div className={`bg-white`}>
                    <App
                        tool={tool}
                        color={color}
                        width={width}
                    />
                </div>

            </div>
            <div className={`w-4/12 bg-white px-5 py-5`}>
                <input
                    className={`mb-10 mt-10`}
                    type="range"
                    min="1"//min can be 0
                    max="50" //max can be 255
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    style={{ backgroundColor: `rgb(val-50, val, val-20)`, width: '100%' }} //you can do same trick as you like
                />
                <CirclePicker
                    circleSize={20}
                    circleSpacing={5}
                    onChange={(color) => setColor(color.hex)}
                />
            </div>

        </div>
    )
}

export default MainApp