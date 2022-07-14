import { useEffect, useRef } from 'react';
import { Buffer } from 'buffer';

import { bffApi } from '../services/bffApi';
import { wsClient } from '../services/bffApi/websocket';

import './canvas.css';
import { updatePixel } from '../services/bffApi/websocket/emitters';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const pick = (event: MouseEvent, ctx: CanvasRenderingContext2D) => {
    const x = Math.floor(event.offsetX/50);
    const y = Math.floor(event.offsetY/50);
    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;

    const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    console.log(x, y, rgba);

    updatePixel(200, x, y)
  }

  const draw = async (ctx: CanvasRenderingContext2D) => {
    const canvasRaw = await bffApi.getCanvas('rawRGBA');
    const canvasArr = new Uint8ClampedArray(Buffer.from(canvasRaw));
    const size = Math.floor(Math.sqrt(canvasArr.length >> 2));
    const canvasImg = await createImageBitmap(new ImageData(canvasArr, size, size));
    ctx.drawImage(canvasImg, 0, 0)
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    canvas.addEventListener('click', (event) => {
      pick(event, ctx);
    });
    draw(ctx)
    wsClient.initCanvasSocket()
    return function cleanup() {
      wsClient.closeSocket()
    };
  }, [])

  return (
    <div id='canvas-div'>
      <canvas id='canvas' ref={canvasRef} width='10px' height='10px'/>
    </div>
  )
}