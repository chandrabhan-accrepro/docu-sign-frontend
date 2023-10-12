import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import SigningComp from "./SigningComp";
import config from "./config";

function DocumentsList() {
  const [allDocuments, setAllDocuments] = useState([]);
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalSignature, setShowModalSignature] = useState(false);
  const [fileNameForSign, SetFileNameForSign] = useState("");
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? config.productionUrl
      : config.localUrl;
  useEffect(() => {
    const getAllDocuments = async () => {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      const response = await axios.get(`${apiUrl}/api/getDocuments`);
      console.log("All document Fetched:", response.data.result);
      setAllDocuments(response.data.result);
    };
    getAllDocuments();
  }, []);

  function openModal() {
    setShowModal(true);
  }

  // Function to close the modal
  function closeModal() {
    setShowModal(false);
  }

  return (
    <div>
      <h3
        className="text-secondary"
        style={{ textAlign: "center", textDecoration: "underline" }}
      >
        List of all Documents
      </h3>
      {allDocuments && (
        <table
          className="table table-bordered"
          style={{
            width: "80%",
            margin: "auto",
            marginBottom: "5rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Signed doc links</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allDocuments.map((filename, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      setUrl(`${apiUrl}/api/getDocuments/${filename}`);
                      openModal();
                    }}
                  >
                    {filename}
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      SetFileNameForSign(filename);
                      setShowModalSignature(true);
                    }}
                  >
                    Request Signature
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* This modal for the document Show original one's */}
      <Modal
        show={showModal}
        onHide={closeModal}
        dialogClassName="modal-90w"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Signed Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            title="Signed Document"
            width="100%"
            height="500"
            src={url}
            frameBorder="0"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* This Modal is for showing the form of Signature */}
      <Modal
        show={showModalSignature}
        onHide={() => setShowModalSignature(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Form of Signature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SigningComp fileNameForSign={fileNameForSign} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalSignature(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DocumentsList;
