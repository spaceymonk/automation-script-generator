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
      className={`flex w-full justify-${
        showRemoveBtn ? "between" : "center"
      } items-center`}

    >
      <div className={`lowercase text-${showRemoveBtn ? "left ml-1" : "center mx-auto"}`}>
        {title}
      </div>
      {showRemoveBtn && (
        <button className="ml-auto mr-2 bg-block rounded-full text-right " onClick={onRemove}>
          <Image src="/remove.svg" width={8} height={8} alt="remove" />
        </button>
      )}
    </div>
  );
}
