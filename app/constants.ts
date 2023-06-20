import { MarkerType } from "reactflow";
import ClickBlock from "./block-components/click-block";
import CustomEdge from "./block-components/custom-edge";
import FindBlock from "./block-components/find-block";
import StartBlock from "./block-components/start-block";
import WaitBlock from "./block-components/wait-block";

export const nodeWidth = 80;
export const nodeHeight = 80;
export const lineColor = "#457B9D";
export const infoColor = "#1D3557";
export const lime400Color = "#a3e635";
export const red600Color = "#dc2626";

export const snapGrid = [20, 20] as [number, number];
export const nodeTypes = {
  start: StartBlock,
  find: FindBlock,
  click: ClickBlock,
  wait: WaitBlock,
};
export const edgeTypes = {
  custom: CustomEdge,
};

export const defaultEdgeStyle = {
  strokeWidth: 2,
  stroke: lineColor,
  strokeLinejoin: "round",
};
export const defaultEdgeMarkerEnd = {
  type: MarkerType.ArrowClosed,
  color: lineColor,
};
