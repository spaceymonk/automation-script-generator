// TODO: write generate button logic
// TODO: write about button logic

import "./about-modal.css";

import { useState } from "react";
import Modal from "react-modal";

export default function ButtonGroup() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="my-4 mx-6 select-none">
        <button
          className="bg-interact text-white capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1 mr-4 
                    hover:contrast-50"
        >
          generate
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-app text-interact capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1
                    hover:bg-interact hover:text-white hover:contrast-50"
        >
          about
        </button>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        closeTimeoutMS={150}
        className="bg-app text-info font-sans rounded-2xl text-center mx-8 w-fit  md:w-96 p-5 drop-shadow-lg select-none"
      >
        <h2 className="text-info text-center font-bold text-xl underline uppercase font-sans mb-5">
          about
        </h2>
        <div className="mt-5">
          <p className="my-3">
            Create your automation workflow by creating and connecting the
            blocks.
          </p>
          <p className="my-3">
            Click “Generate” button to get the Python script of the automation.
          </p>
          <p className="my-3">
            To run the generated script you will need to setup a Python
            environment.
          </p>
        </div>
        <p className="italic my-5">
          More details on GitHub:
          <br />
          <a
            href="https://www.github.com/spaceymonk/automation-script-generator"
            className="text-interact underline block hover:contrast-75"
          >
            github.com/spaceymonk/automation-script-generator
          </a>
        </p>

        <button
          onClick={() => setShowModal(false)}
          className="bg-app text-interact capitalize border-2 border-interact rounded-xl
                    transition duration-150 ease-in-out px-6 py-1
                    hover:bg-interact hover:text-white hover:contrast-50"
        >
          close
        </button>
      </Modal>
    </>
  );
}
