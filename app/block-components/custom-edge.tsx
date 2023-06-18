import React from "react";
import { EdgeProps, MarkerType, SmoothStepEdge } from "reactflow";

// TODO: add true false labels for find block

export default function CustomEdge(props: EdgeProps) {
  return (
    <>
      <SmoothStepEdge
        {...props}
        style={{ ...props.style, strokeDasharray: props.selected ? 6 : 0 }}
      />
    </>
  );
}
