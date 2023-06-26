import Modal from "react-modal";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import pythonLang from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import vs from "react-syntax-highlighter/dist/esm/styles/hljs/vs";

SyntaxHighlighter.registerLanguage("python", pythonLang);

export function GenerateModal({
  show,
  onClose,
  text,
}: {
  show: boolean;
  onClose: () => void;
  text: string;
}) {
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      closeTimeoutMS={150}
      className="bg-app text-info font-sans rounded-2xl m-4 p-5 max-h-full w-full max-w-3xl  flex flex-col drop-shadow-lg outline-none"
    >
      <h2 className="text-info text-center font-bold text-xl underline uppercase select-none font-sans mb-5">
        script
      </h2>
      <SyntaxHighlighter
        className="rounded-lg bg-board mb-5 overflow-auto w-full "
        showLineNumbers
        language="python"
        style={vs}
        lineNumberStyle={{ color: "#777", width:"7%" }}
      >
        {text}
      </SyntaxHighlighter>
      
      <div className="text-right">
        <button
          onClick={onClose}
          className="bg-app text-interact capitalize border-2 border-interact rounded-xl
                          transition duration-150 ease-in-out px-6 py-1 select-none
                          hover:bg-interact hover:text-white hover:contrast-50"
        >
          close
        </button>
      </div>
    </Modal>
  );
}
