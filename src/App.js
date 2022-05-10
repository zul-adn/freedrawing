import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Line, Text, Image, Transformer } from 'react-konva';
import useImage from 'use-image';

async function downloadURI(uri, name) {

  const img = await fetch(uri)
  const imageBlog = await img.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  var link = document.createElement('a');
  link.download = name;
  link.href = imageURL;
  document.body.appendChild(link);
  //link.click();
  //document.body.removeChild(link);
  setTimeout(function () {
    link.click();
    // Cleanup the DOM 
    document.body.removeChild(link);
    // DOWNLOAD_COMPLETED = true; 
    //document.getElementById('nextButton').onclick(); 
  }, 1000);
}

const Images = ({ imageProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [image] = useImage(imageProps.files, 'Anonymous');

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        onTap={onSelect}
        image={image}
        width={200}
        height={350}
        ref={shapeRef}  
        {...imageProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...imageProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          // node.scaleX(1);
          // node.scaleY(1);
          onChange({
            ...imageProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      >
      </Image>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const App = (props) => {
  // const [tool, setTool] = React.useState('pen');
  React.useEffect(() => {
    console.log(props)
  }, [props])

  const {
    tool,
    color,
    width,
    images
  } = props

  const [lines, setLines] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imagee, setImagee] = React.useState(images)



  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedImage(null);
    }
  };

  const isDrawing = React.useRef(false);
  const stageRef = React.useRef(null);

  const handleExport = () => {
    //console.log(images)
    const uri = stageRef.current.toDataURL()
    downloadURI(uri, 'image.png');
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedImage(null);
    }

    setLines([...lines, { tool, points: [pos.x, pos.y], color, width }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div
      style={{ overflowY: 'hidden' }} >
      <button
        id="nextButton"
        onClick={handleExport}
        className="absolute bg-blue-500 right-20 bottom-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-9"
      >Save Image</button>
      <Stage
        width={window.innerWidth - 400}
        height={window.innerHeight - 80}
        onTouchstart={handleMouseDown}
        onTouchmove={handleMouseMove}
        onTouchend={handleMouseUp}
        onMousedown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        // onMouseDown={checkDeselect}
        // onTouchStart={checkDeselect}
        ref={stageRef}
      >
        <Layer>
          {imagee.map((image, i) => {
            return (
              <Images
                key={i}
                imageProps={image}
                isSelected={image.id === selectedImage}
                onSelect={() => {
                  setSelectedImage(image.id);
                }}
                onChange={(newAttrs) => {
                  const image = images.slice();
                  //   rects[i] = newAttrs;
                  //   setRectangles(rects);
                }}
                crossorigin="anonymous"
              />
            );
          }
          )}

          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
               line.tool !== '' ? line.tool === 'eraser' ? 'destination-out' : 'source-over' : null
              }
            />
          ))}

        </Layer>
      </Stage>
    </div>
  );
}

export default App;
