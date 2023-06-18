import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Panel,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import Image from "next/image";
import StartBlock from "../block-components/start-block";
import { useCallback, useEffect, useRef, useState } from "react";

const infoColor = "#1D3557";
const snapGrid = [20, 20] as [number, number];
const nodeTypes = {
  start: StartBlock,
  find: StartBlock,
  click: StartBlock,
  wait: StartBlock,
};

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const reactFlowWrapperRef = useRef<any>(null);
  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );
  const onEdgeUpdate = useCallback(
    (oldEdge: any, newConnection: any) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );
  const clearAnimations = useCallback(() => {
    setEdges((edges) => edges.map((e) => ({ ...e, selected: false })));
    setNodes((nodes) => nodes.map((n) => ({ ...n, selected: false })));
  }, []);

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

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: Math.floor(Math.random() * 100).toString(),
        type,
        position,
        data: null,
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
          onInit={setReactFlowInstance}
          connectionLineType={ConnectionLineType.SmoothStep}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          proOptions={{ hideAttribution: true }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={clearAnimations}
          onEdgeUpdate={onEdgeUpdate}
          onSelectionChange={(params) => {
            params.edges.forEach((edge) => {
              setEdges((edges) =>
                edges.map((e) => ({ ...e, animated: edge.selected }))
              );
            });
          }}
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
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
