import { useEffect, useState } from "react";
import { AboutModal } from "./about-modal";

export default function ButtonGroup() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState({
    request: false,
    shouldOpen: false,
  });

  const closeAboutModal = () => setShowAboutModal(false);
  const openAboutModal = () => setShowAboutModal(true);
  const closeGenerateModal = () => {
    setShowGenerateModal((prev) => ({ shouldOpen: false, request: false }));
  };
  const openGenerateModal = () => {
    // TODO: replace below async method to generate logic
    const timer = setTimeout(
      () => setShowGenerateModal((prev) => ({ ...prev, shouldOpen: true })),
      1000
    );
    setShowGenerateModal((prev) => ({ ...prev, request: true }));
  };

  useEffect(() => {
    if (!showGenerateModal.request) {
      setShowGenerateModal({ request: false, shouldOpen: false });
    }
  }, [showGenerateModal.request]);

  return (
    <>
      <div className="my-4 mx-6 select-none flex items-center justify-start">
        <button
          disabled={showGenerateModal.request}
          onClick={openGenerateModal}
          className={`bg-interact text-white capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1 mr-4 outline-none text-center
                    hover:contrast-50 disabled:contrast-50 w-28 h-9`}
        >
          {showGenerateModal.request && !showGenerateModal.shouldOpen ? (
            <svg
              className="animate-spin h-full w-full text-white"
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
      <AboutModal
        showAboutModal={showAboutModal}
        closeAboutModal={closeAboutModal}
      />
      {/* TODO: create GenerateModal */}
      <AboutModal
        showAboutModal={showGenerateModal.shouldOpen}
        closeAboutModal={closeGenerateModal}
      />
    </>
  );
}
