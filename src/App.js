import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Line, Text } from 'react-konva';

const App = (props) => {
  // const [tool, setTool] = React.useState('pen');
  const {
    tool,
    color,
    width
  } = props
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

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
      <Stage
        width={window.innerWidth - 400}
       height={window.innerHeight - 80}

        onTouchstart={handleMouseDown}
        onTouchmove={handleMouseMove}
        onTouchend={handleMouseUp}
        onMousedown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}

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
