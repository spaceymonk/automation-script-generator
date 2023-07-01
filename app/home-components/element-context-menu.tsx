import Image from "next/image";
import { Item, ItemParams, Menu } from "react-contexify";

export default function ElementContextMenu({ onItemClick, id }: { id: string; onItemClick: (_: ItemParams) => void }) {
  return (
    <>
      <Menu className="bg-app p-2 font-sans" id={id} animation="scale">
        <Item
          className="bg-white hover:bg-[#3498db] transition-all duration-150 ease-in-out rounded-sm"
          onClick={onItemClick}
        >
          <Image src="/remove.svg" width={20} height={20} alt="remove block"></Image>
          <span className="capitalize ml-2">remove element</span>
        </Item>
      </Menu>
    </>
  );
}
