import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { AboutModal } from "./about-modal";
import { GenerateModal } from "./generate-modal";
import { generate } from "./generate.util";

export default function ButtonGroup() {
  const { getNodes, getEdges } = useReactFlow();

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [generateModalState, setGenerateModalState] = useState({
    request: false,
    show: false,
    text: "",
  });

  const closeAboutModal = () => setShowAboutModal(false);
  const openAboutModal = () => setShowAboutModal(true);
  const closeGenerateModal = () => {
    setGenerateModalState((prev) => ({
      ...prev,
      request: false,
      show: false,
    }));
  };
  const openGenerateModal = () => {
    setGenerateModalState((prev) => ({ ...prev, show: false, request: true }));
    generate(getNodes(), getEdges())
      .then((text) =>
        setGenerateModalState((prev) => ({ ...prev, text, show: true }))
      )
      .catch((reason) => {
        console.error(reason);
        // TODO: better handle generation fails
        closeGenerateModal();
      });
  };

  useEffect(() => {
    if (!generateModalState.request && generateModalState.show) {
      closeGenerateModal();
    }
  }, [generateModalState.request, generateModalState.show]);

  return (
    <>
      <div className="my-4 mx-6 select-none flex items-center justify-start">
        <button
          disabled={generateModalState.request}
          onClick={openGenerateModal}
          className={`bg-interact text-white capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1 mr-4 outline-none text-center
                    hover:contrast-50 disabled:contrast-50`}
        >
          {generateModalState.request && !generateModalState.show ? (
            <svg
              className="animate-spin h-6 min-w-max "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "generate"
          )}
        </button>
        <button
          onClick={openAboutModal}
          className="bg-app text-interact capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1 outline-none
                    hover:bg-interact hover:text-white hover:contrast-50"
        >
          about
        </button>
      </div>
      <AboutModal show={showAboutModal} onClose={closeAboutModal} />
      <GenerateModal
        show={generateModalState.show}
        onClose={closeGenerateModal}
        text={generateModalState.text}
      />
    </>
  );
}
