import Image from "next/image";
import { useCallback, useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlow,
} from "reactflow";
import { nodeHeight, nodeWidth } from "../constants";

export default function CustomEdge(props: EdgeProps) {
  const { deleteElements } = useReactFlow();
  const onEdgeClick = useCallback(
    () => deleteElements({ edges: [{ id: props.id }] }),
    [deleteElements, props.id]
  );
  const { labelX, labelY, path } = useMemo(() => getPath(props), [props]);

  return (
    <>
      <BaseEdge
        {...props}
        path={path}
        style={{
          ...props.style,
          strokeDasharray: props.selected ? 6 : 0,
        }}
      />
      {props.selected && (
        <EdgeRemoveBtn
          labelX={labelX}
          labelY={labelY}
          onEdgeClick={onEdgeClick}
        />
      )}
    </>
  );
}

function EdgeRemoveBtn({
  labelX,
  labelY,
  onEdgeClick,
}: {
  labelX: number;
  labelY: number;
  onEdgeClick: () => void;
}) {
  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          pointerEvents: "all",
        }}
        className="nodrag nopan"
      >
        <button
          className="flex text-center bg-board rounded-full hover:animate-bounce p-0.5"
          onClick={onEdgeClick}
        >
          <Image
            priority
            src="/remove.svg"
            width={12}
            height={12}
            alt="remove"
          />
        </button>
      </div>
    </EdgeLabelRenderer>
  );
}

function getPath({
  targetX,
  targetY,
  sourceX,
  sourceY,
  sourceHandleId,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceHandleId?: string | null;
}): { labelX: number; labelY: number; path: string } {
  const w = Math.abs(sourceX - targetX);
  const h = targetY - sourceY;

  if (targetX >= sourceX) {
    //     d1
    //   +----+
    //        |
    //        | h
    //        |
    //        +------+
    //           d2
    let d1 = w / 2;
    let d2 = d1;
    const path = `M ${sourceX} ${sourceY} h ${d1} v ${h} h ${d2}`;

    const labelX = sourceX + w / 2;
    const labelY = sourceY + h / 2;
    return { labelX, labelY, path };
  }

  //      d5
  //    +---+
  //    |   ^
  //    |   h          d1
  // d4 |   V<  w  >+-----+
  //    |                 | d2
  //    +-----------------+
  //           d3
  let d1 = nodeWidth / 4 - 4;
  let d2 = Math.max(Math.abs(h / 2), nodeHeight / 2 + nodeHeight / 4);
  if (h < 0) d2 *= -1;
  let d4 = h - d2;
  let d5 = d1;
  let d3 = -(w + d5 + d1);

  if (sourceHandleId === "false") {
    d2 = Math.max(h / 2 - nodeHeight / 4, nodeHeight / 2);
    d4 = h - d2;
  } else if (sourceHandleId === "true") {
    d2 = Math.min(h / 2 + nodeHeight / 4, -nodeHeight / 2);
    d4 = h - d2;
  }

  const path = `M ${sourceX} ${sourceY} h ${d1} v ${d2} h ${d3} v ${d4} h ${d5}`;
  const labelX = sourceX + d1 - w / 2 - d5;
  const labelY = sourceY + d2;
  return { labelX, labelY, path };
}
