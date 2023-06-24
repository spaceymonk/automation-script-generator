"use client";

import "react-contexify/dist/ReactContexify.css";
import "reactflow/dist/style.css";

import Modal from "react-modal";

import { ReactFlowProvider } from "reactflow";

import Board from "./home-components/board";
import ButtonGroup from "./home-components/button-group";
import Title from "./home-components/title";

export default function Home() {
  Modal.setAppElement("#root");
  return (
    <div className="bg-app flex flex-col h-screen">
      <ReactFlowProvider>
        <Title />
        <Board />
        <ButtonGroup />
      </ReactFlowProvider>
    </div>
  );
}
