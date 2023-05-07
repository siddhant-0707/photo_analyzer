import React, { useRef, useLayoutEffect } from "react";
import Image from "react-bootstrap/Image";

export const ImageDisplay = (props) => {
  const imgRef = useRef();
  const canvasRef = useRef();

  useLayoutEffect(() => {
    const positionCanvas = (event) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (img) {
        // Update the canvas position to match that of the image.
        canvas.style.position = "absolute";
        canvas.style.left = img.offsetLeft + "px";
        canvas.style.top = img.offsetTop + "px";
        canvas.width = img.offsetWidth;
        canvas.height = img.offsetHeight;

        // Boxes are defined as fractions of the total height and width of
        // the image.
        const context = canvas.getContext("2d");
        context.strokeStyle = 'LimeGreen';
        context.lineWidth = 1;
        props.boxes.forEach((box) => {
          context.rect(
            canvas.width * box.BoundingBox.Left,
            canvas.height * box.BoundingBox.Top,
            canvas.width * box.BoundingBox.Width,
            canvas.height * box.BoundingBox.Height);
          context.stroke();
        });
      }
    };

    window.addEventListener("resize", positionCanvas);
    positionCanvas();
    return () => window.removeEventListener("resize", positionCanvas);
  }, [props.boxes]);

  return (
    <div>
      <Image fluid
        ref={imgRef}
        src={props.src}
        alt={props.alt}
      />
      <canvas ref={canvasRef}/>
    </div>
  );
};
