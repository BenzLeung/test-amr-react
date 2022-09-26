/**
 * @file Player
 * @author Benz(https://github.com/BenzLeung)
 * @date 2022-09-22
 * Created by JetBrains WebStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import BenzAMRRecorder from 'benz-amr-recorder';
import { Timer } from './Timer';

const MarioAmrFile = process.env.PUBLIC_URL + '/mario.amr';

export function Player() {
  const [isLoading, setIsLoading] = useState(false);
  const [amr, setAmr] = useState<BenzAMRRecorder | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (amr) {
      amr.onPlay(() => setIsPlaying(true));
      amr.onPause(() => setIsPlaying(false));
      amr.onResume(() => setIsPlaying(true));
      amr.onEnded(() => setIsPlaying(false));
      amr.onStop(() => setIsPlaying(false));
    }
  }, [amr, setIsPlaying, setCurrentTime]);
  const onAmr = useCallback((a: BenzAMRRecorder) => {
    if (amr) {
      amr.stop();
    }
    setAmr(a);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(a.getDuration());
  }, [amr, setIsLoading, setAmr, setIsPlaying, setCurrentTime, setDuration]);
  const initAmrWithUrl = useCallback((url: string) => {
    setIsLoading(true);
    const a = new BenzAMRRecorder();
    a.initWithUrl(url).then(() => {
      onAmr(a);
    });
  }, [setIsLoading, onAmr]);
  const loadMario = useCallback(() => {
    initAmrWithUrl(MarioAmrFile);
  }, [initAmrWithUrl]);
  const initAmrWithFile = useCallback((file: File) => {
    setIsLoading(true);
    const a = new BenzAMRRecorder();
    a.initWithBlob(file).then(() => {
      onAmr(a);
    });
  }, [setIsLoading, onAmr]);
  const fileOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      initAmrWithFile(files[0]);
    }
  }, [initAmrWithFile]);
  const playOrPause = useCallback(() => {
    amr?.playOrPauseOrResume();
  }, [amr]);
  const stop = useCallback(() => {
    amr?.stop();
  }, [amr]);
  const onProgressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    amr?.setPosition(e.target.value);
  }, [amr]);
  const timer = useMemo(() => {
    return new Timer(() => {}, 32);
  }, []);
  const startDrag = useCallback(() => {
    timer.stop();
  }, [timer]);
  const stopDrag = useCallback(() => {
    timer.start();
  }, [timer]);
  useEffect(() => {
    timer.setFunction(() => {
      if (amr) {
        setCurrentTime(amr.getCurrentPosition());
      }
    });
    timer.start();
  }, [timer, amr, setCurrentTime]);

  return (
    <div>
      <p>
        <span>加载演示文件：</span>
        <button onClick={loadMario} disabled={isLoading}>加载、解码</button>
        <a href={MarioAmrFile} download>下载演示文件：mario.amr</a>
      </p>
      <p>
        <span>加载本地文件：</span>
        <input type="file" id="amr-file" accept=".amr" onChange={fileOnChange} />
        <span>（不会上传到任何服务器）</span>
      </p>
      <p>
        <button
          id="amr-play"
          disabled={isLoading || !amr}
          onClick={playOrPause}
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button id="amr-stop" disabled={isLoading || !amr} onClick={stop}>停止</button>
        <input
          id="amr-progress"
          type="range"
          min={0}
          max={duration}
          step="any"
          value={currentTime}
          disabled={isLoading || !amr}
          onChange={onProgressChange}
          onMouseDown={startDrag}
          onMouseUp={stopDrag}
        />
        <label htmlFor="amr-progress">
          <span id="amr-cur">{currentTime.toFixed(2)}'</span>
          <span>/</span>
          <span id="amr-duration">{duration}'</span>
        </label>
      </p>
    </div>
  );
}

export default Player;
