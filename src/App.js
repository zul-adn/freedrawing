import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Line, Text } from 'react-konva';
import { triggerBase64Download } from 'react-base64-downloader';

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

const App = (props) => {
  // const [tool, setTool] = React.useState('pen');
  const {
    tool,
    color,
    width
  } = props
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const stageRef = React.useRef(null);

  const handleExport = () => {
    const uri = stageRef.current.toDataURL()
    downloadURI(uri, 'image.png');
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
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
    <div style={{ overflowY: 'hidden' }}>
      <button
        id="nextButtin"
        onClick={handleExport}
        class=" absolute bg-blue-500 right-20 bottom-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-9"
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
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
