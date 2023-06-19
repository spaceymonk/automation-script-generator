import Image from "next/image";
import { BaseEdge, EdgeLabelRenderer, EdgeProps } from "reactflow";
import { nodeHeight, nodeWidth } from "../constants";

export default function CustomEdge(props: EdgeProps) {
  if (props.targetX >= props.sourceX) {
    const w = props.targetX - props.sourceX;
    const h = props.targetY - props.sourceY;
    let d1 = Math.max(w / 2, nodeWidth / 4 - 4);
    let d2 = d1;
    const path = `M ${props.sourceX} ${props.sourceY} h ${d1} v ${h} h ${d2}`;

    const labelX = props.sourceX + w / 2;
    const labelY = props.sourceY + h / 2;
    const onEdgeClick = () => {
      // TODO: handle edge removal
      throw new Error("Function not implemented.");
    };

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
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              className="nodrag nopan "
            >
              <button
                className="flex text-center bg-board rounded-full hover:animate-pulse p-0.5"
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
        )}
      </>
    );
  }

  //      d5
  //    +---+  ^
  //    |      h      d1
  // d4 |      V    +-----+
  //    |   <   w   >     | d2
  //    +-----------------+
  //           d3
  const w = props.sourceX - props.targetX;
  const h = props.targetY - props.sourceY;
  let d1 = nodeWidth / 4 - 4;
  let d2 = Math.max(Math.abs(h / 2), nodeHeight / 2 + nodeHeight / 4);
  if (h < 0) d2 *= -1;
  let d4 = h - d2;
  let d5 = d1;
  let d3 = -(w + d5 + d1);

  if (props.sourceHandleId === "find-false") {
    d2 = Math.max(h / 2, nodeHeight / 2 - 10);
    if (h < 0) d2 *= -1;
    d4 = h + 10 - nodeHeight / 2;
  } else if (props.sourceHandleId === "find-true") {
    d2 = -10 - nodeHeight / 4;
    d4 = h - 10 + nodeHeight / 2;
  }
  const path = `M ${props.sourceX} ${props.sourceY} h ${d1}  v ${d2} h ${d3} v ${d4} h ${d5}`;

  // TODO: add remove button here too
  // TODO: handle find block's handles size thingy.

  return (
    <BaseEdge
      {...props}
      path={path}
      style={{
        ...props.style,
        strokeDasharray: props.selected ? 6 : 0,
      }}
    />
  );
}
