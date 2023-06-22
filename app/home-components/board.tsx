import "./context-menu.css";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  Edge,
  Panel,
  ReactFlowInstance,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
  ItemParams,
} from "react-contexify";
import {
  defaultEdgeMarkerEnd,
  defaultEdgeStyle,
  edgeTypes,
  infoColor,
  green600Color,
  lineColor,
  nodeHeight,
  nodeTypes,
  nodeWidth,
  red600Color,
  snapGrid,
} from "../constants";

const MENU_ID = "context-menu-id";

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const onConnect = useCallback(
    (params: Connection) => {
      const opacity = "a0";
      let strokeColor = lineColor + opacity;
      if (params.sourceHandle === "find-false")
        strokeColor = red600Color + opacity;
      if (params.sourceHandle === "find-true")
        strokeColor = green600Color + opacity;
      const edge = {
        ...params,
        markerEnd: { ...defaultEdgeMarkerEnd, color: strokeColor },
        style: { ...defaultEdgeStyle, stroke: strokeColor },
        type: "custom",
      } as Edge;
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  const { show } = useContextMenu({
    id: MENU_ID,
  });
  const handleItemClick = ({
    event,
    props,
    triggerEvent,
    data: type,
  }: ItemParams) => {
    if (reactFlowWrapperRef.current === null)
      throw new Error("onDragOver: reactFlowWrapperRef.current is null");
    const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
    if (reactFlowInstance === null)
      throw new Error("onDrop: reactFlowInstance is null");
    const position = reactFlowInstance.project({
      x: triggerEvent.clientX - (reactFlowBounds.left + nodeWidth),
      y: triggerEvent.clientY - (reactFlowBounds.top + nodeHeight),
    });
    const newNode = {
      id: `id-${Math.floor(Math.random() * 100)}`,
      type,
      position,
      data: { text: "", width: nodeWidth, height: nodeHeight },
    };
    setNodes((nds) => nds.concat(newNode));
  };
  const displayMenu = (e: React.MouseEvent) => {
    show({
      event: e,
    });
  };

  useEffect(() => {
    setNodes([
      {
        id: "1",
        type: "start",
        data: { text: "", width: 80, height: 80 },
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        type: "click",
        data: { text: "", width: 80, height: 80 },
        position: { x: 300, y: 0 },
      },
      {
        id: "3",
        type: "wait",
        data: { text: "", width: 80, height: 80 },
        position: { x: 300, y: 300 },
      },
      {
        id: "4",
        type: "find",
        data: { text: "", width: 80, height: 80 },
        position: { x: 0, y: 300 },
      },
    ]);
  }, []);

  const onPaneClick = (event: React.MouseEvent) => {
    if (event.detail === 2) {
      event.preventDefault();
      reactFlowInstance?.fitView();
    }
  };
  return (
    <div className="h-full w-full px-6">
      <Menu id={MENU_ID} animation="scale">
        <Item data="start" onClick={handleItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/start-block.png"
              width={60}
              height={60}
              alt="start block"
            ></Image>
          </div>
        </Item>
        <Item data="click" onClick={handleItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/click-block.png"
              width={60}
              height={60}
              alt="click block"
            ></Image>
          </div>
        </Item>
        <Item data="wait" onClick={handleItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/wait-block.png"
              width={60}
              height={60}
              alt="wait block"
            ></Image>
          </div>
        </Item>
        <Item data="find" onClick={handleItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/find-block.png"
              width={60}
              height={60}
              alt="find block"
            ></Image>
          </div>
        </Item>
      </Menu>
      <div
        ref={reactFlowWrapperRef}
        className="bg-board w-full h-full rounded-xl"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          connectionLineType={ConnectionLineType.Straight}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          proOptions={{ hideAttribution: true }}
          onEdgeUpdate={onEdgeUpdate}
          selectNodesOnDrag={false}
          onPaneClick={onPaneClick}
          onPaneContextMenu={displayMenu}
          zoomOnDoubleClick={false}
          fitView
        >
          <Background
            color={infoColor}
            gap={snapGrid}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
