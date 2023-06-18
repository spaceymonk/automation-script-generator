import { Handle, Position } from "reactflow";
import BlockTitle from "./block-title";
import Image from "next/image";
import { useState } from "react";

export default function StartBlock({
  data,
  isConnectable,
  selected,
}: {
  data: Record<string, any>;
  isConnectable: boolean;
  selected: boolean;
}) {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        className={`bg-block text-info border-info font-mono rounded-md
                  w-20 h-20 border-2 hover:drop-shadow-lg  ${selected && "border-dashed"}`}
      >
        <BlockTitle
          title="start"
          showRemoveBtn={mouseOver || selected}
          onRemove={() => {
            console.log("removed");
          }}
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
        className={`bg-line border-0 ${selected && "animate-pulse"}`}
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </>
  );
}
