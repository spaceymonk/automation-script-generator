import { useCallback, useRef, useState } from "react";
import { ItemParams, contextMenu } from "react-contexify";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  Edge,
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
  green600Color,
  infoColor,
  lineColor,
  nodeHeight,
  nodeTypes,
  nodeWidth,
  red600Color,
  snapGrid,
} from "../constants";
import ContextMenu from "./context-menu";

const MENU_ID = "context-menu-id";
let __id__ = 1;
const getId = () => __id__++;

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const opacity = "a0";
      let strokeColor = lineColor + opacity;
      if (params.sourceHandle === "false") strokeColor = red600Color + opacity;
      if (params.sourceHandle === "true") strokeColor = green600Color + opacity;
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
    [setEdges]
  );
  const handleItemClick = useCallback(
    ({ event, props, triggerEvent, data: type }: ItemParams) => {
      contextMenu.hideAll();
      if (reactFlowWrapperRef.current === null)
        throw new Error("onDragOver: reactFlowWrapperRef.current is null");
      const reactFlowBounds =
        reactFlowWrapperRef.current.getBoundingClientRect();
      if (reactFlowInstance === null)
        throw new Error("onDrop: reactFlowInstance is null");
      const position = reactFlowInstance.project({
        x:
          triggerEvent.clientX -
          (reactFlowBounds.left +
            (nodeWidth * reactFlowInstance.getZoom()) / 2),
        y:
          triggerEvent.clientY -
          (reactFlowBounds.top +
            (nodeHeight * reactFlowInstance.getZoom()) / 2),
      });
      const newNode = {
        id: `block-${getId()}`,
        type,
        position,
        data: { text: "", width: nodeWidth, height: nodeHeight },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  const displayMenu = useCallback((e: React.MouseEvent) => {
    contextMenu.show({
      id: MENU_ID,
      event: e,
    });
  }, []);
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.detail === 2) {
        event.preventDefault();
        reactFlowInstance?.fitView();
      }
    },
    [reactFlowInstance]
  );

  return (
    <div className="h-full w-full px-6">
      <ContextMenu onItemClick={handleItemClick} id={MENU_ID} />
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
          // TODO: add onNodeContextMenu to remove block
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
