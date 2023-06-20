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
  defaultEdgeMarkerEnd,
  defaultEdgeStyle,
  edgeTypes,
  infoColor,
  lime400Color,
  lineColor,
  nodeHeight,
  nodeTypes,
  nodeWidth,
  red400Color,
  snapGrid,
} from "../constants";

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const onConnect = useCallback(
    (params: Connection) => {
      let strokeColor = lineColor+'d9';
      if (params.sourceHandle === "find-false") strokeColor = red400Color+'d9';
      if (params.sourceHandle === "find-true") strokeColor = lime400Color+'d9';
      const edge = {
        ...params,
        markerEnd: { ...defaultEdgeMarkerEnd },
        style: { ...defaultEdgeStyle },
        type: "custom",
      };
      edge.style.stroke = strokeColor;
      edge.markerEnd.color = strokeColor;
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    if (event.dataTransfer === null)
      throw new Error("onDragStart: event.dataTransfer is null");

    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer === null)
      throw new Error("onDragOver: event.dataTransfer is null");
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (reactFlowWrapperRef.current === null)
        throw new Error("onDragOver: reactFlowWrapperRef.current is null");
      const reactFlowBounds =
        reactFlowWrapperRef.current.getBoundingClientRect();

      if (event.dataTransfer === null)
        throw new Error("onDrop: event.dataTransfer is null");
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (reactFlowInstance === null)
        throw new Error("onDrop: reactFlowInstance is null");
      const position = reactFlowInstance.project({
        x: event.clientX - (reactFlowBounds.left + nodeWidth),
        y: event.clientY - (reactFlowBounds.top + nodeHeight),
      });
      const newNode = {
        id: `id-${Math.floor(Math.random() * 100)}`,
        type,
        position,
        data: { text: "", width: nodeWidth, height: nodeHeight },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

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
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
          selectNodesOnDrag={false}
          onPaneClick={onPaneClick}
          zoomOnDoubleClick={false}
          fitView
        >
          <Background
            color={infoColor}
            gap={snapGrid}
            variant={BackgroundVariant.Dots}
          />
          <Panel style={{ margin: 0 }} position={"bottom-right"}>
            <div className="bg-app rounded-md px-4 py-3 mr-5 mb-5 drop-shadow-md">
              <h3 className="text-info text-center font-semibold underline uppercase font-sans mb-5 select-none">
                drag to add
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
                  draggable
                  onDragStart={(event) => onDragStart(event, "start")}
                >
                  <Image
                    src="/start-block.png"
                    width={60}
                    height={60}
                    alt="start block"
                  ></Image>
                </div>
                <div
                  className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
                  draggable
                  onDragStart={(event) => onDragStart(event, "click")}
                >
                  <Image
                    src="/click-block.png"
                    width={60}
                    height={60}
                    alt="click block"
                  ></Image>
                </div>
                <div
                  className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
                  draggable
                  onDragStart={(event) => onDragStart(event, "wait")}
                >
                  <Image
                    src="/wait-block.png"
                    width={60}
                    height={60}
                    alt="wait block"
                  ></Image>
                </div>
                <div
                  className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
                  draggable
                  onDragStart={(event) => onDragStart(event, "find")}
                >
                  <Image
                    src="/find-block.png"
                    width={60}
                    height={60}
                    alt="find block"
                  ></Image>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
