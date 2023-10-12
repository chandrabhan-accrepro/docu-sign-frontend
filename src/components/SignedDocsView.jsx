import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import config from "./config";

function SignedDocsView() {
  const [pdfUrl, setPdfUrl] = useState([]);
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? config.productionUrl
      : config.localUrl;

  useEffect(() => {
    downloadPdf();
  }, []);
  async function downloadPdf() {
    const { data } = await getPdf();
    console.log("Data from backend: ", data);
    // const blob = new Blob([data], { type: "application/pdf" });
    // setPdfUrl(blob);
    setPdfUrl(data.result);
    // saveAs(blob, "docusign-implementation.pdf");
  }

  async function getPdf() {
    return axios.get(`${apiUrl}/api/v1/getPdfs`, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      // responseType: "arraybuffer",
    });
  }
  // console.log(pdfUrl);
  // Function to open the modal
  function openModal() {
    setShowModal(true);
  }

  // Function to close the modal
  function closeModal() {
    setShowModal(false);
  }

  return (
    <div>
      {/* <button onClick={downloadPdf}>View Signed DOC's</button> */}
      {/* {pdfUrl && (
        <div className="pdf-popup">
          <Document file={pdfUrl}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )} */}
      {pdfUrl && (
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
            </tr>
          </thead>
          <tbody>
            {pdfUrl.map((filename, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      setUrl(`${apiUrl}/api/v1/getPdf/${filename}`);
                      openModal();
                    }}
                  >
                    {filename}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/*  http://localhost:8000/api/v1/getPdf/Docu-sign-implementatio_2fcd30c2-1201-4684-aa90-3b35c2c5275b.pdf */}

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
    </div>
  );
}

export default SignedDocsView;
