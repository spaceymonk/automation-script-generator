'use client'
import 'reactflow/dist/style.css';
import "react-contexify/dist/ReactContexify.css";

import Modal from 'react-modal';

import Board from "./home-components/board";
import ButtonGroup from "./home-components/button-group";
import Title from "./home-components/title";

export default function Home() {
  Modal.setAppElement('#root');
  return (
    <div className="bg-app flex flex-col h-screen">
      <Title />
      <Board />
      <ButtonGroup />
    </div>
  );
}
