import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";
import Image from "next/image";
import { useRef, useState } from "react";

export default function WaitBlock({
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(data.text);

  // TODO: update input field changes to reactflow node array

  return (
    <>
      <Handle
        className={`bg-line border-0 ${selected && "animate-pulse"}  w-3 h-3`}
        type="target"
        position={Position.Left}
        id="a"
        isConnectable={isConnectable}
      />
      <div
        onClick={() => {
          if (inputRef.current === null)
            throw new Error("WaitBlock.onClick: inputRef.current is null");
          inputRef.current.focus();
        }}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        style={{ width: data.width, height: data.height }}
        className={`bg-block text-info border-info font-mono rounded-sm
                  border-2 ${selected && "border-dashed"} `}
      >
        <BlockTitle
          title="wait"
          showRemoveBtn={mouseOver || selected}
          onRemove={() => deleteElements({ nodes: [{ id }] })}
        />
        <div className="flex justify-center pt-1.5">
          <Image
            src="/wait-block-icon.svg"
            width={28}
            height={28}
            alt="wait block icon"
          />
        </div>
        <div className="flex mx-1 pt-1">
          <input
            ref={inputRef}
            className="w-full font-mono bg-block block text-xs text-center focus:bg-board rounded-full outline-none nodrag"
            type="text"
            name="input-field"
            id="input-field"
            placeholder="t"
            defaultValue={data.text}
            onChange={(event) => setText(event.target.value)}
          />
          <span className="text-xs">sec</span>
        </div>
      </div>
      <Handle
        className={`bg-line border-0 ${selected && "animate-pulse"} w-3 h-3`}
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
}
