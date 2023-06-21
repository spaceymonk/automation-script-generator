import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";

export default function ClickBlock({
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
        className={`bg-line/90 border-0 ${selected && "animate-pulse"} w-2 h-2`}
        type="target"
        position={Position.Left}
        id="a"
        isConnectable={isConnectable}
      />
      <div
        onClick={() => {
          if (inputRef.current === null)
            throw new Error("ClickBlock.onClick: inputRef.current is null");
          inputRef.current.focus();
        }}
        style={{ width: data.width, height: data.height }}
        className={`bg-block/90 text-info ring-info/50 font-mono rounded-md
                   shadow-sm ${
                     selected && "ring-2"
                   } transition-all duration-75 ease-in-out`}
      >
        <BlockTitle
          title="click"
          showRemoveBtn={selected}
          onRemove={() => deleteElements({ nodes: [{ id }] })}
        />
        <div className="flex justify-center pt-1">
          <Image
            src="/click-block-icon.svg"
            width={32}
            height={31}
            alt="click block icon"
          />
        </div>
        <div className="flex mx-1 pt-1.5 ">
          <input
            ref={inputRef}
            className="w-full font-mono bg-block block text-xs text-center focus:bg-board rounded-full outline-none nodrag"
            type="text"
            name="input-field"
            id="input-field"
            placeholder="x, y"
            defaultValue={data.text}
            onChange={(event) => setText(event.target.value)}
          />
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
