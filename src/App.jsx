import { useEffect, useState } from "react";
import "./App.css";
import SigningComp from "./components/SigningComp";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import SignedDocsView from "./components/SignedDocsView";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import WebhookRegistration from "./components/WebHookRegistration";
import TimeAgo from "./components/TimeAgo";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import DocumentsList from "./components/DocumentsList";
import { Modal, Button } from "react-bootstrap";
import config from "./components/config";

function App() {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const localStorageData = localStorage.getItem("myData")
    ? JSON.parse(localStorage.getItem("myData"))
    : [];
  const SignersData = localStorage.getItem("receiver-details")
    ? JSON.parse(localStorage.getItem("receiver-details"))
    : [];
  const [data, setData] = useState([]);
  const [key, setKey] = useState("tab1");
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // localStorageData ? localStorageData.splice(-10).reverse() : []

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? config.productionUrl
      : config.localUrl;
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      try {
        const response = await axios.get(`${apiUrl}/statusenveloper`);
        console.log(response.data);
        const envelopes = response.data.results.envelopes;
        const updatedEnvelopes = envelopes.map((item) => {
          const tempData = SignersData.find((signer) => {
            if (signer.id == item.envelopeId) {
              return {
                ...item,
                ...signer,
              };
            }
          });
          // console.log(tempData);
          if (tempData !== undefined) {
            return { ...item, ...tempData };
          }
          return item;
        });
        console.log("Updated Envelopes data: ", updatedEnvelopes);
        updatedEnvelopes &&
          localStorage.setItem("myData", JSON.stringify([...updatedEnvelopes]));
        setData(updatedEnvelopes);
      } catch (error) {
        console.error("Error registering webhook:", error);
        // setEnvelopeData("Internal Server Error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [localStorage.getItem("myData")]);
  const checkDocSigned = async (envelopId) => {
    try {
      setLoading(true);
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      const signerDetailsVar = SignersData.find(
        (item) => item.id === envelopId
      );
      const response = await axios.get(
        `${apiUrl}/checkstatus?envelopId=${envelopId}&docName=${signerDetailsVar.fileNameForSign}`
      );
      console.log(response.data);
      console.log(response.data.results.status);
      if (response.data.results.status === "completed") {
        try {
          console.log("EnvelopID: ", envelopId);
          const response = await axios.post(`${apiUrl}/getDoc`, {
            envelopeId: envelopId,
            docName: signerDetailsVar.fileNameForSign,
          });
          console.log("Document successfully got: ", response.data);
          const allData = localStorage.getItem("myData")
            ? JSON.parse(localStorage.getItem("myData"))
            : [];
          const updatedData = allData.map((item) => {
            if (item.id === envelopId) {
              const newOneIs = {
                ...item,
                status: "completed",
              };
              return newOneIs;
            }
            return item;
          });
          localStorage.setItem("myData", JSON.stringify(updatedData));
          alert("Document Successfully Saved !!!");
        } catch (err) {
          alert("Please try again there is some error in saving !!!");
          console.log("Error in saving: ", err);
        }
      } else {
        alert("Please sign the document from your gmail.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Operation is not valid please try another one.");
    }
  };

  const handleForm = async () => {
    if (selectedFile) {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await axios.post(`${apiUrl}/uploadnewfile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("File Uploaded successfully !!!");
        console.log("File Uploaded: ", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      {/* <div className="">
        {!signed ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10rem",
            }}
          >
            <button
              style={{ height: "4rem" }}
              onClick={() => setSigned(!signed)}
            >
              Sign_doc
            </button>
          </div>
        ) : (
          <div
            style={{
              width: "40%",
              margin: "auto",
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h1 className="text-info">Docu_sign Presentation</h1>
            <br />
            <SigningComp />
          </div>
        )}
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "3rem",
          marginTop: "3rem",
        }}
      >
        <input
          style={{ width: "30%" }}
          className="form-control"
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button onClick={() => handleForm()}>Add</button>
      </div>
      <div
        style={{
          marginTop: "3rem",
        }}
      >
        <DocumentsList />
      </div>

      <Tab.Container
        id="tabs-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="tab1" style={{ fontWeight: "bold" }}>
              Status of requesting Documents
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tab2" style={{ fontWeight: "bold" }}>
              Signed Docs
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="tab1">
            {loading && (
              <div className="text-danger" style={{ textAlign: "center" }}>
                Loading...
              </div>
            )}
            {localStorageData && (
              <table
                className="table table-bordered table-striped"
                style={{ width: "90%", margin: "auto", marginTop: "1rem" }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>EnvelopeId</th>
                    <th>Signer Name</th>
                    <th>Document</th>
                    <th>Signer Email</th>
                    <th>Subject</th>
                    <th>EmailBlurb</th>
                    <th>StatusChangedDateTime</th>
                    <th>VoidedReason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .slice(0, data.length)
                    .reverse()
                    .map((item, index) => (
                      <tr key={item.envelopeId}>
                        <td>{index + 1}.</td>
                        <td>{item.envelopeId}</td>

                        <td>{item?.signerName}</td>
                        {/* <td>{item?.fileNameForSign}</td> */}
                        <td>
                          <a
                            href="#"
                            onClick={() => {
                              setUrl(
                                `${apiUrl}/api/getDocuments/${item?.fileNameForSign}`
                              );
                              setShowModal(true);
                            }}
                          >
                            {item?.fileNameForSign}
                          </a>
                        </td>
                        <td>{item?.signerEmail}</td>
                        <td>{item?.emailSubject}</td>
                        <td>{item?.emailBlurb}</td>
                        {/* <td>{item?.statusChangedDateTime}</td> */}
                        <td>
                          <TimeAgo timestamp={item?.statusChangedDateTime} />
                        </td>
                        <td>{item?.voidedReason}</td>
                        <td>{item?.status}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => checkDocSigned(item.envelopeId)}
                            disabled={
                              item.statusUser == "completed" ? true : false
                            }
                          >
                            Save Signed doc
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="tab2">
            <SignedDocsView />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {/* This modal for the document Show original one's */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-90w"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title> Document</Modal.Title>
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
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
