import React, { useRef, useEffect, useState } from "react";
import classes from './Polygon.module.css';

const Polygon = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

  // User input value, set default point coords to 0,0
  const [inputValue, setInputValue] = useState({
    x: 0,
    y: 0,
  });

  // Initialize that point is not inside Polygon
  const [isInside, setIsInside] = useState(false);

  // Point coords
  const [point, setPoint] = useState([inputValue.x, inputValue.y]);

  // Polygon variables
  const [sides, setSides] = useState(6);
  const canvasRef = useRef(null);
  let vertices = [];

  useEffect(() => {
    drawCanvas();
    setIsInside(isPointInPolygon(point, vertices));
  }, [point, sides]);

  // Draw polygon method
  let drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(...point, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.font = "15px Arial";

    var radius = 150;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX + radius, centerY);

    // Draw polygon and assign alphabet char to each point
    for (var i = 1; i <= sides; i++) {
      var angle = (i * 2 * Math.PI) / sides;
      var x = centerX + radius * Math.cos(angle);
      var y = centerY + radius * Math.sin(angle);
      vertices.push([x, y, alphabet[i - 1]]);
      ctx.lineTo(x, y);
      ctx.fillText(alphabet[i - 1], x + 7, y + 7);
    }
    ctx.closePath();
    ctx.stroke();
  };

  /* Check if point is in Polygon using Rai Casting Method:
  The function uses the line intersection counting algorithm to determine whether a point is inside a polygon. 
  It does this by calculating the intersection of each polygon line (between two adjacent points) 
  with a horizontal line passing through the "point". If there is an odd number of intersections, 
  it means that the point is inside the polygon. */

  let isPointInPolygon = (point, polygon) => {
    const x = point[0],      
      y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      const intersect =
        (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Set point coords based on user input
  let inputValueHandler = (value, axis) => {
    setInputValue((prevState) => {
      let newValue = { ...prevState, [axis]: value };
      setPoint(Object.values(newValue));
      return newValue;
    });
  };

  // Change polygon size based on user input
  let sizeValueHandler = (value) => {
    // Validate user input
    if (value > 26 || value < 3) {
      alert("Please enter a number between 3 and 26!");
      return;
    }
    setSides(value);
  };

  return (
    <div className={classes.canvasWrapper}>
      <canvas ref={canvasRef} width="400" height="400" />
      <div className={classes.wrapper}>
        <label>
          <span>Point coordinates:</span>
          <input
            type="number"
            min="0"
            step="1"
            value={inputValue.x}
            onChange={(event) => inputValueHandler(event.target.value, "x")}
          ></input>
          <input
            type="number"
            min="0"
            step="1"
            value={inputValue.y}
            onChange={(event) => inputValueHandler(event.target.value, "y")}
          ></input>
          <small>
            Note: X, Y coords should be in range of 0-400 in order for point to be visible on screen.
          </small>
          <h5 className={isInside ?  classes.success : classes.warning}>
            {"Point" + (isInside ? " is  " : " is not ") + "in polygon!"}
          </h5>
        </label>
        <label>
          <span>Number of polygon sides:</span>
          <input
            type="number"
            min="3"
            max="26"
            step="1"
            value={sides}
            onChange={(event) => sizeValueHandler(event.target.value)}
          ></input>
        </label>
      </div>
    </div>
  );
};

export default Polygon;
