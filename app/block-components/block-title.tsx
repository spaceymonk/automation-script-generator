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
      <div className={`lowercase transition-all ease-in-out duration-150 text-center mx-auto ${showRemoveBtn ? "" : "translate-x-4"}`}>{title}</div>
      <button
        disabled={!showRemoveBtn}
        className={`p-1 transition-all ease-in-out duration-150 ml-auto mr-2 text-right hover:animate-bounce ${
          showRemoveBtn ? "opacity-100" : "-translate-x-4 opacity-0 cursor-grab"
        }`}
        onClick={onRemove}
      >
        <Image priority src="/remove.svg" width={10} height={10} alt="remove" />
      </button>
    </div>
  );
}
