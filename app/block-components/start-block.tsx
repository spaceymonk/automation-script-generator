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

  return (
    <>
      <div
        style={{ width: data.width, height: data.height }}
        className={`bg-block/90 text-info ring-info/50 font-mono rounded-md
                  shadow-sm ${selected && "ring-2"} transition-all duration-75 ease-in-out`}
      >
        <BlockTitle
          title="start"
          showRemoveBtn={selected}
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
        className={`bg-line/90 border-1 border-block/90 rounded-sm w-3 h-5 -right-2 ${
          selected && "animate-pulse"
        }`}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
}
