import React from 'react';
import App from './App';
import { Slider, RangeSlider } from 'rsuite';
import { SketchPicker, CirclePicker } from 'react-color';
import { storage } from './firebase';
import { ref, getDownloadURL, uploadBytesResumable, listAll } from "firebase/storage";

import 'rsuite/styles/index.less';

const MainApp = () => {

    React.useEffect(() => {
        getImages()
    }, []);

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

    const getImages = () => {
        let items = []
        const listRef = ref(storage, "files");
        listAll(listRef).then(res => {
            res.items.forEach((itemRef) => {
                items.push(itemRef.name)
            });
            setFiles(items)
        }).catch((error) => {
            console.log(error)
        })
        
    }

    const [tool, setTool] = React.useState('pen');
    const [color, setColor] = React.useState('#00000');
    const [width, setWidth] = React.useState(1);
    const [media, setMedia] = React.useState(false)
    const [imgUrl, setImgUrl] = React.useState(null);
    const [progresspercent, setProgresspercent] = React.useState(0);
    const [files, setFiles] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [isChoose, setIsChoose] = React.useState(true)
    const [isUpload, setIsUpload] = React.useState(false)

    const handleChange = (e) => {
        setIsChoose(false)
        const file = e.target[0]?.files[0]
        setImgUrl(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const file = e.target[0]?.files[0]
        console.log(file)
        if (!file) return;
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        setIsUpload(true)
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
                getImages()
                setIsUpload(false)
            },
            (error) => {
                alert(error);
            },
        );
    }

    return (
        <div className={`h-screen flex overflow-y-hidden overflow-x-hidden`}>
            <div className={`w-16 bg-white shadow-default py-2 px-2 mt-10`}>
                <ul >
                    <li onClick={() => setTool('pen')} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bx-pen'></i></li>
                    <li onClick={() => setTool('eraser')} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bxs-eraser'></i></li>
                    <li onClick={() => setMedia(!media)} className={`py-3 px-4 rounded-md cursor-pointer text-cyan text-sm flex justify-center hover:bg-cyan-100`}><i class='bx bxs-image-alt'></i></li>
                </ul>
            </div>
            <div className={`w-4/5 flex bg-cyan-800 py-5 px-5 `}>
                <div className={`bg-white`}>
                    <App
                        tool={tool}
                        color={color}
                        width={width}
                        images={images}
                    />
                </div>

            </div>
            <div className={`w-4/12 bg-white px-5 py-5 overflow-y-scroll`}>
                {media ?
                    <div>
                        {files.map((files, i) =>
                            <img
                                style={{ marginBottom: 20 }}
                                className={`cursor-pointer`}
                                src={`https://firebasestorage.googleapis.com/v0/b/react-konva.appspot.com/o/files%2F${files}?alt=media&token=ef35122b-c17e-4c1c-a727-72dfc97745cc`}
                                onClick={() => {
                                    images.push({
                                        id: i,
                                        files: `https://firebasestorage.googleapis.com/v0/b/react-konva.appspot.com/o/files%2F${files}?alt=media&token=ef35122b-c17e-4c1c-a727-72dfc97745cc`
                                    })
                                }}
                            />
                        )}
                        <form onSubmit={handleSubmit}>
                            {/* {isChoose ? */}
                            <label className="absolute bg-yellow-500 right-20 bottom-10 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded z-9 curseor-hand">
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                // onChange={handleChange}
                                />
                                Choose Image
                            </label>
                            {/* : */}
                            <button type="submit" >{isUpload ? progresspercent : "Upload Image"}</button>
                            {/* } */}
                        </form>
                    </div>
                    :
                    <>
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
                    </>
                }
            </div>

        </div>
    )
}

export default MainApp
