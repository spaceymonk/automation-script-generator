import Image from "next/image";
import { Menu, Item, ItemParams } from "react-contexify";

export default function ContextMenu({
  onItemClick,
  id,
}: {
  id: string;
  onItemClick: (_: ItemParams) => void;
}) {
  return (
    <>
      <Menu className="bg-app w-max" id={id} animation="scale">
        <Item
          className="inline-block border-0"
          data="start"
          onClick={onItemClick}
        >
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/start-block.png"
              width={60}
              height={60}
              alt="start block"
            ></Image>
          </div>
        </Item>
        <Item className="inline-block" data="click" onClick={onItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/click-block.png"
              width={60}
              height={60}
              alt="click block"
            ></Image>
          </div>
        </Item>
        <Item className="inline-block" data="wait" onClick={onItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/wait-block.png"
              width={60}
              height={60}
              alt="wait block"
            ></Image>
          </div>
        </Item>
        <Item className="inline-block" data="find" onClick={onItemClick}>
          <div
            className="transition-all ease-in-out duration-150 hover:contrast-75 cursor-pointer"
            draggable
          >
            <Image
              src="/find-block.png"
              width={60}
              height={60}
              alt="find block"
            ></Image>
          </div>
        </Item>
      </Menu>
    </>
  );
}
