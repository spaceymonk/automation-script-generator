'use client'
import 'reactflow/dist/style.css';

import Board from "./home-components/board";
import ButtonGroup from "./home-components/button-group";
import Title from "./home-components/title";

export default function Home() {
  return (
    <div className="bg-app flex flex-col h-screen">
      <Title />
      <Board />
      <ButtonGroup />
    </div>
  );
}
