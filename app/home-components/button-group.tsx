export default function ButtonGroup() {
  return (
    <div className="my-4 mx-6 select-none">
      <button
        className="bg-interact text-white capitalize border-2 border-interact rounded-xl
                  transition duration-150 ease-in-out px-6 py-1 mr-4 
                  hover:contrast-50"
      >
        generate
      </button>
      <button
        className="bg-app text-interact capitalize border-2 border-interact rounded-xl
                  transition duration-150 ease-in-out px-6 py-1
                  hover:bg-interact hover:text-white hover:contrast-50"
      >
        about
      </button>
    </div>
  );
}
