import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";
import Image from "next/image";
import { useRef, useState } from "react";
import { nodeHeight } from "../constants";

export default function FindBlock({
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
  const {deleteElements} = useReactFlow();
  const [mouseOver, setMouseOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(data.text);

  // TODO: update input field changes to reactflow node array

  return (
    <>
      <Handle
        className={`bg-line border-0 ${selected && "animate-pulse"} w-3 h-3`}
        type="target"
        position={Position.Left}
        id="a"
        isConnectable={isConnectable}
      />
      <div
        onClick={() => {
          if (inputRef.current === null)
            throw new Error("FindBlock.onClick: inputRef.current is null");
          inputRef.current.focus();
        }}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        style={{ width: data.width, height: data.height }}
        className={`bg-block text-info border-info font-mono rounded-sm
                  border-2 ${selected && "border-dashed"}`}
      >
        <BlockTitle
          title="find"
          showRemoveBtn={mouseOver || selected}
          onRemove={() => deleteElements({ nodes: [{ id }] })}
        />
        <div className="flex justify-center pt-1.5">
          <Image
            src="/find-block-icon.svg"
            width={28}
            height={28}
            alt="find block icon"
          />
        </div>
        <div className="flex mx-1 pt-1">
          <input
            ref={inputRef}
            className="w-full font-mono bg-block block text-xs text-center 
                     focus:bg-board rounded-full outline-none nodrag"
            type="text"
            name="input-field"
            id="input-field"
            placeholder="image"
            defaultValue={data.text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      </div>
      <Handle
        className={`border-0 ${selected && "animate-pulse"} w-3 h-3`}
        type="source"
        position={Position.Right}
        id="find-true"
        isConnectable={isConnectable}
        style={{ top: nodeHeight / 4, backgroundColor: "lime" }}
      />
      <Handle
        className={`border-0 ${selected && "animate-pulse"} w-3 h-3`}
        type="source"
        position={Position.Right}
        id="find-false"
        isConnectable={isConnectable}
        style={{
          bottom: nodeHeight / 4,
          top: nodeHeight - nodeHeight / 4,
          backgroundColor: "red",
        }}
      />
    </>
  );
}
