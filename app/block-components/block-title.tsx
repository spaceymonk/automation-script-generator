import Image from "next/image";

export default function BlockTitle({
  title,
  showRemoveBtn,
  onRemove,
}: {
  title: string;
  showRemoveBtn: boolean
  onRemove: () => void;
}) {

  // TODO: make button appering animated
  return (
    <div
      className={`text-xs flex w-full justify-${
        showRemoveBtn ? "between" : "center"
      } items-center pt-0.5`}

    >
      <div className={`lowercase text-${showRemoveBtn ? "left ml-1" : "center mx-auto"}`}>
        {title}
      </div>
      {showRemoveBtn && (
        <button className="ml-auto mr-2 bg-block rounded-full text-right hover:animate-pulse" onClick={onRemove}>
          <Image priority src="/remove.svg" width={8} height={8} alt="remove" />
        </button>
      )}
    </div>
  );
}
