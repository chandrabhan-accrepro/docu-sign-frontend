import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function SigningComp({ fileNameForSign }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [docuSignUrl, setDocuSignUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [envelopIdCont, setEnvelopIdCont] = useState(null);
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const localstorageData = localStorage.getItem("receiver-details")
    ? JSON.parse(localStorage.getItem("receiver-details"))
    : [];

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleSave = async () => {
    try {
      console.log("EnvelopID: ", envelopIdCont);
      const response = await axios.post("http://localhost:8000/getDoc", {
        envelopeId: envelopIdCont,
      });
      console.log("Document successfully got: ", response.data);
      alert("Document Successfully Saved !!!");
    } catch (err) {
      alert("Please try again there is some error in saving !!!");
      console.log("Error in saving: ", err);
    }
    setShowModal(false);
  };

  const Sign_doc_func = async (action) => {
    console.log(subject, emailBody);
    setLoading(true);
    const response = await axios.post("http://localhost:8000/form", {
      name,
      email,
      subject,
      emailBody,
      fileNameForSign,
    });
    console.log(response.data.url);
    setDocuSignUrl(response.data.url);
    console.log(response.data.envelopeId);
    setEnvelopIdCont(response.data.envelopeId);
    if (action === "Sign_Doc") {
      openModal();
    }

    setLoading(false);
    if (action === "Send_For_Sign") {
      const status = "pending";
      const userData = {
        id: response.data.envelopeId,
        signerName: name,
        signerEmail: email,
        signerSubject: subject,
        signerEmailBody: emailBody,
        statusUser: status,
        fileNameForSign,
      };
      const dataJSON = [...localstorageData, userData];
      localStorage.setItem("receiver-details", JSON.stringify(dataJSON));
      alert("Document successfully sent to provided email !!!");
    }
  };
  return (
    <div>
      {loading && <div className="text-primary">Loading...</div>}
      <input
        className="form-control"
        type="text"
        placeholder="Enter the name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />
      <input
        className="form-control"
        type="text"
        placeholder="Enter the email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <input
        className="form-control"
        type="text"
        placeholder="Enter the subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <br />
      <br />
      <textarea
        className="form-control"
        type="text"
        placeholder="Enter the Email Body"
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        rows={4}
      />
      <br />
      <br />
      <div className="d-flex justify-content-around">
        <button onClick={() => Sign_doc_func("Send_For_Sign")}>
          Send_For_Sign_the_doc
        </button>
        <button onClick={() => Sign_doc_func("Sign_Doc")}>Sign_the_doc</button>
      </div>

      <Modal
        show={showModal}
        onHide={closeModal}
        dialogClassName="modal-90w"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Docu Sign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            title="Docu Sign"
            width="100%"
            height="500"
            src={docuSignUrl}
            frameBorder="0"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SigningComp;
