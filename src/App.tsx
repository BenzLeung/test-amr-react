import React from 'react';
import './App.css';
import Player from './Player';
import Recorder from './Recorder';

function App() {


  return (
    <div className="App">
      <h1>AMR 录音机 Demo</h1>
      <h2>解码、播放</h2>
      <Player />
      <h2>录音、编码</h2>
      <Recorder />
    </div>
  );
}

export default App;
