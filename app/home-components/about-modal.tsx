import Modal from "react-modal";

export function AboutModal({
  showAboutModal, closeAboutModal,
}: {
  showAboutModal: boolean;
  closeAboutModal: () => void;
}) {
  return (
    <Modal
      isOpen={showAboutModal}
      onRequestClose={closeAboutModal}
      closeTimeoutMS={150}
      className="bg-app text-info font-sans rounded-2xl text-center mx-8 w-fit  md:w-96 p-5 drop-shadow-lg select-none outline-none"
    >
      <h2 className="text-info text-center font-bold text-xl underline uppercase font-sans mb-5">
        about
      </h2>
      <div className="mt-5">
        <p className="my-3">
          Create your automation workflow by creating and connecting the blocks.
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
        onClick={closeAboutModal}
        className="bg-app text-interact capitalize border-2 border-interact rounded-xl
              transition duration-150 ease-in-out px-6 py-1
              hover:bg-interact hover:text-white hover:contrast-50"
      >
        close
      </button>
    </Modal>
  );
}
