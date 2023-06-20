import { Handle, Position, useReactFlow } from "reactflow";
import BlockTitle from "./block-title";
import Image from "next/image";
import { useRef, useState } from "react";

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
  const { deleteElements } = useReactFlow();
  const [mouseOver, setMouseOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(data.text);

  // TODO: update input field changes to reactflow node array

  return (
    <>
      <Handle
        className={`bg-line border-0 ${
          selected && "animate-pulse shadow-lg"
        } w-3 h-3`}
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
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        style={{ width: data.width, height: data.height }}
        className={`bg-block text-info border-info font-mono rounded-sm
                   border-2 ${selected && "border-dashed"}`}
      >
        <BlockTitle
          title="click"
          showRemoveBtn={mouseOver || selected}
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
        <div className="flex mx-1 pt-0.5 ">
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
        className={`bg-line border-0 ${
          selected && "animate-pulse shadow-lg"
        } w-3 h-3`}
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
}
