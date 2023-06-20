import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const { deleteElements, setNodes } = useReactFlow();
  const [mouseOver, setMouseOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(data.text);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === id) {
          n.data.text = text;
        }
        return n;
      })
    );
  }, [text]);

  return (
    <>
      <Handle
        className={`bg-line/90 border-0 ${selected && "animate-pulse"}  w-2 h-2`}
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
        className={`bg-block text-info ring-info/50 font-mono rounded-md
                  shadow-sm ${selected && "ring-2"} transition-all duration-75 ease-in-out`}
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
        <div className="flex mx-1 pt-2">
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
        className={`bg-line/90 border-0 ${selected && "animate-pulse"} w-2 h-2`}
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
}
