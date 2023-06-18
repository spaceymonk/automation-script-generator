import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  Edge,
  MarkerType,
  Panel,
  ReactFlowInstance,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import Image from "next/image";
import StartBlock from "../block-components/start-block";
import ClickBlock from "../block-components/click-block";
import WaitBlock from "../block-components/wait-block";
import { useCallback, useEffect, useRef, useState } from "react";

const infoColor = "#1D3557";
const snapGrid = [20, 20] as [number, number];
const nodeTypes = {
  start: StartBlock,
  find: StartBlock,
  click: ClickBlock,
  wait: WaitBlock,
};

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params}, eds)),
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
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: Math.floor(Math.random() * 100).toString(),
        type,
        position,
        data: { text: "" },
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
        data: null,
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        type: "click",
        data: { text: "" },
        position: { x: 300, y: 0 },
      },
      {
        id: "3",
        type: "wait",
        data: { text: "" },
        position: { x: 300, y: 300 },
      },
    ]);
  }, []);

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
          defaultEdgeOptions={{
            markerEnd: MarkerType.Arrow,
            type: "smoothstep",
          }}
          onInit={setReactFlowInstance}
          connectionLineType={ConnectionLineType.SmoothStep}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          proOptions={{ hideAttribution: true }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
          // TODO: add double click to fit-view
          zoomOnDoubleClick={false}
          fitView
        >
          <Background color={infoColor} variant={BackgroundVariant.Dots} />
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
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
