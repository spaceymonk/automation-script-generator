// TODO: write generate button logic
// TODO: write about button logic

import { useState } from "react";
import { AboutModal } from "./about-modal";

export default function ButtonGroup() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const closeAboutModal = () => setShowAboutModal(false);
  const openAboutModal = () => setShowAboutModal(true);
  return (
    <>
      <div className="my-4 mx-6 select-none">
        <button
          className="bg-interact text-white capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1 mr-4 outline-none
                    hover:contrast-50"
        >
          generate
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
    </>
  );
}
