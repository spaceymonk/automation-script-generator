import Image from "next/image";
import { useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";

export default function StartBlock({
  id,
  data,
  isConnectable,
  selected,
}: {
  id: string;
  data: Record<string, any>;
  isConnectable: boolean;
  selected: boolean;
}) {
  const { deleteElements } = useReactFlow();

  const [mouseOver, setMouseOver] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        style={{ width: data.width, height: data.height }}
        className={`bg-block text-info border-info font-mono rounded-sm
                  border-2 ${selected && "border-dashed"}`}
      >
        <BlockTitle
          title="start"
          showRemoveBtn={mouseOver || selected}
          onRemove={() => deleteElements({ nodes: [{ id }] })}
        />
        <div className="flex justify-center py-2">
          <Image
            src="/start-block-icon.svg"
            width={23}
            height={25}
            alt="start block icon"
          />
        </div>
      </div>
      <Handle
        className={`bg-line border-0 ${selected && "animate-pulse"}  w-3 h-3`}
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </>
  );
}
