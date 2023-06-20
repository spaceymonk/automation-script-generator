import Image from "next/image";

export default function BlockTitle({
  title,
  showRemoveBtn,
  onRemove,
}: {
  title: string;
  showRemoveBtn: boolean;
  onRemove: () => void;
}) {
  return (
    <div className={`text-xs flex w-full justify-center items-center pt-0.5`}>
      <div className={`lowercase text-center mx-auto`}>{title}</div>
      <button
        className={` transition-all ease-in-out duration-75 ml-auto mr-2 text-right hover:animate-bounce ${showRemoveBtn ? "opacity-100":"opacity-0"}`}
        onClick={onRemove}
      >
        <Image priority src="/remove.svg" width={10} height={10} alt="remove" />
      </button>
    </div>
  );
}
