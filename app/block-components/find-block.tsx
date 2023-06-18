import { Handle, Position } from "reactflow";
import BlockTitle from "./block-title";
import Image from "next/image";
import { useRef, useState } from "react";

export default function FindBlock({
  data,
  isConnectable,
  selected,
}: {
  data: Record<string, any>;
  isConnectable: boolean;
  selected: boolean;
}) {
  const [mouseOver, setMouseOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(data.text);

  // TODO: update input field changes to reactflow node array

  return (
    <>
      <Handle
        className={`bg-line border-0 ${selected && "animate-pulse"}`}
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
        className={`bg-block text-info border-info font-mono rounded-md
                  border-2 ${selected && "border-dashed"}`}
      >
        <BlockTitle
          title="find"
          showRemoveBtn={mouseOver || selected}
          onRemove={() => {
            console.log("removed");
          }}
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
        className={`bg-line border-0 ${selected && "animate-pulse"}`}
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
        style={{ top: 10 }}
      />
      <Handle
        className={`bg-line border-0 ${selected && "animate-pulse"}`}
        type="source"
        position={Position.Right}
        id="c"
        isConnectable={isConnectable}
        style={{ bottom: 10, top: data.height - 10 }}
      />
    </>
  );
}
