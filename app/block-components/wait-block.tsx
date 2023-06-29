import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";

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
        className={`bg-line/90 border-1 border-block/90 rounded-sm w-3 h-5 -left-2 ${
          selected && "animate-pulse"
        }`}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div
        onClick={() => {
          if (inputRef.current === null)
            throw new Error("WaitBlock.onClick: inputRef.current is null");
          inputRef.current.focus();
        }}
        style={{ width: data.width, height: data.height }}
        className={`bg-block/90 text-info ring-info/50 font-mono rounded-md
                  shadow-sm ${
                    selected && "ring-2"
                  } transition-all duration-75 ease-in-out`}
      >
        <BlockTitle
          title="wait"
          showRemoveBtn={selected}
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
