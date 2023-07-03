import { useCallback, useRef, useState } from "react";
import { ItemParams, contextMenu } from "react-contexify";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  DeleteElementsOptions,
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
import ElementContextMenu from "./element-context-menu";
import PaneContextMenu from "./pane-context-menu";

const PANE_CONTEXT_MENU_ID = "pane-context-menu-id";
const ELEMENT_CONTEXT_MENU_ID = "node-context-menu-id";
let __id__ = 1;
const getId = () => __id__++;

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const elementsToRemove = useRef<DeleteElementsOptions>({});
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

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
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );
  const handlePaneContextItemClick = useCallback(
    ({ triggerEvent, data: type }: ItemParams) => {
      contextMenu.hideAll();
      if (reactFlowWrapperRef.current === null)
        throw new Error("handlePaneContextItemClick: reactFlowWrapperRef.current is null");
      const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
      if (reactFlowInstance === null) throw new Error("handlePaneContextItemClick: reactFlowInstance is null");
      const position = reactFlowInstance.project({
        x: triggerEvent.clientX - (reactFlowBounds.left + (nodeWidth * reactFlowInstance.getZoom()) / 2),
        y: triggerEvent.clientY - (reactFlowBounds.top + (nodeHeight * reactFlowInstance.getZoom()) / 2),
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
  const handleElementContextItemClick = useCallback(() => {
    contextMenu.hideAll();
    if (reactFlowInstance === null) throw new Error("handleElementContextItemClick: reactFlowInstance is null");
    reactFlowInstance.deleteElements(elementsToRemove.current);
  }, [reactFlowInstance]);
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
      <PaneContextMenu onItemClick={handlePaneContextItemClick} id={PANE_CONTEXT_MENU_ID} />
      <ElementContextMenu onItemClick={handleElementContextItemClick} id={ELEMENT_CONTEXT_MENU_ID} />
      <div ref={reactFlowWrapperRef} className="bg-board w-full h-full rounded-xl">
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
          onNodeDrag={() => contextMenu.hideAll()}
          onSelectionDragStart={() => contextMenu.hideAll()}
          onDragStartCapture={() => contextMenu.hideAll()}
          onPaneContextMenu={(e) => contextMenu.show({ id: PANE_CONTEXT_MENU_ID, event: e })}
          onNodeContextMenu={(event, node) => {
            elementsToRemove.current = { nodes: [node] };
            contextMenu.show({ id: ELEMENT_CONTEXT_MENU_ID, event: event });
          }}
          onSelectionContextMenu={(event, nodes) => {
            elementsToRemove.current = { nodes };
            contextMenu.show({ id: ELEMENT_CONTEXT_MENU_ID, event: event });
          }}
          onEdgeContextMenu={(event, edge) => {
            elementsToRemove.current = { edges: [edge] };
            contextMenu.show({ id: ELEMENT_CONTEXT_MENU_ID, event: event });
          }}
          zoomOnDoubleClick={false}
        >
          <Background color={infoColor} gap={snapGrid} variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
}
