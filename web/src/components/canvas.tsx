import { useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';
import { Divider, Spin, Typography } from 'antd';
import { CirclePicker, ColorResult } from 'react-color';

import { bffApi } from '../services/bffApi';
import { wsClient } from '../services/bffApi/websocket';
import { updatePixel } from '../services/bffApi/websocket/emitters';

import './canvas.css';

const colors = [
  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
  '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400',
  '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
  '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E',
  '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
  '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
]

const to8bit = ({r, g, b}: {r:number,g:number,b:number}) => {
  return Math.floor((r * 7 / 255) << 5) + Math.floor((g * 7 / 255) << 2) + Math.floor((b * 3 / 255))
}

export default function Canvas() {
  const [ loading, setLoading ] = useState(true);
  const [ pickedColor, _setPickedColor ] = useState<any>();
  const colorRef = useRef(pickedColor);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const setPickedColor = (val: ColorResult) => {
    colorRef.current = val;
    _setPickedColor(val)
  }

  const pick = (ctx: CanvasRenderingContext2D) => {
    return (event: MouseEvent) => {
      const scale = Math.floor(
        (document.getElementById('canvas')?.offsetWidth!-12)/canvasRef.current?.width!);
      const x = Math.round((event.offsetX-12)/scale);
      const y = Math.round((event.offsetY-12)/scale);

      updatePixel(to8bit(colorRef.current.rgb), x, y)
    }
  }

  const draw = async (ctx: CanvasRenderingContext2D) => {
    const canvasRaw = await bffApi.getCanvas('rawRGBA');
    const canvasArr = new Uint8ClampedArray(Buffer.from(canvasRaw));
    const size = Math.floor(Math.sqrt(canvasArr.length >> 2));
    const canvasImg = await createImageBitmap(new ImageData(canvasArr, size, size));
    canvasRef.current!.width = size;
    canvasRef.current!.height = size;
    ctx.drawImage(canvasImg, 0, 0);
    await wsClient.initCanvasSocket();
    setLoading(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const listener = pick(ctx);
    canvas.addEventListener('click', listener);
    draw(ctx);
    return function cleanup() {
      wsClient.closeSocket()
      canvas.removeEventListener('click', listener);
    };
  }, [])

  return (
    <div id='canvas-div'>
      <div className='canvas-container' hidden={!loading}><Spin size='large' /></div>
      <canvas className='canvas-container' id='canvas' ref={canvasRef}/>
      <div id='controls-div'>
        <Typography.Title style={{marginBottom: '0px'}}>Choose Color</Typography.Title>
        <Divider style={{margin: '10px 0px 15px'}}/>
        <CirclePicker
          color={pickedColor}
          onChange={(c, e) => setPickedColor(c)}
          colors={colors}
        />
      </div>
    </div>
  )
}