import Image from "next/image";

export default function Title() {
  return (
    <div className="my-5 mx-6 font-sans text-info flex select-none">
      <div className="flex items-center">
        <Image src="/app-icon.png" width={50} height={50} alt="app icon"></Image>
      </div>
      <div className="ml-5">
        <h1 className="font-semibold text-2xl capitalize">automation script generator</h1>
        <h2 className="text-xl">v1.0</h2>
      </div>
    </div>
  );
}
