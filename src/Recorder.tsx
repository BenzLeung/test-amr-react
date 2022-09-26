/**
 * @file Recorder
 * @author Benz(https://github.com/BenzLeung)
 * @date 2022-09-22
 * Created by JetBrains WebStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import React, { useCallback, useEffect, useState } from 'react';
import BenzAMRRecorder from 'benz-amr-recorder';

export function Recorder() {
  const [amr, setAmr] = useState<BenzAMRRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [downLink, setDownLink] = useState('');

  useEffect(() => {
    if (amr) {
      amr.onPlay(() => setIsPlaying(true));
      amr.onPause(() => setIsPlaying(false));
      amr.onResume(() => setIsPlaying(true));
      amr.onEnded(() => setIsPlaying(false));
      amr.onStop(() => setIsPlaying(false));
      amr.onStartRecord(() => setIsRecording(true));
      amr.onFinishRecord(() => setIsRecording(false));
      amr.onCancelRecord(() => setIsRecording(false));
    }
  }, [amr, setIsRecording, setIsPlaying]);
  const startRecord = useCallback(() => {
    setIsRecording(true);
    const a = new BenzAMRRecorder();
    a.initWithRecord().then(() => {
      a.startRecord();
    }).catch(function(e) {
      alert(e.message || e.name || JSON.stringify(e));
    });
    setAmr(a);
  }, [setIsRecording, setAmr]);
  const stopRecord = useCallback(() => {
    setIsRecording(false);
    if (amr && amr.isRecording()) {
      amr.finishRecord().then(() => {
        setDownLink(window.URL.createObjectURL(amr.getBlob()));
        setDuration(amr.getDuration());
      });
    }
  }, [amr, setIsRecording, setDownLink, setDuration]);
  const toggleRecord = useCallback(() => {
    if (amr && amr.isRecording()) {
      stopRecord();
    } else {
      startRecord();
    }
  }, [amr, startRecord, stopRecord]);
  const togglePlay = useCallback(() => {
    if (amr) {
      if (amr.isPlaying()) {
        amr.stop();
      } else {
        amr.play();
      }
    }
  }, [amr]);

  return (
    <div id="recorder-amr">
      <p>
        <button id="amr-record" onClick={toggleRecord}>
          {isRecording ? '停止录音' : '开始录音'}
        </button>
        <span>（不会上传到任何服务器）</span>
      </p>
      <p>
        <button
          id="amr-play-record"
          disabled={!amr || amr.isRecording()}
          onClick={togglePlay}
        >
          {isPlaying ? '停止播放' : '播放录音'}
        </button>
        {downLink ? (
          <a href={downLink} id="amr-down-record">下载录音amr文件</a>
        ) : null}
        <span id="amr-record-duration">{duration}'</span>
      </p>
    </div>
  )
}

export default Recorder;
