import { useState } from "react";
import "./App.css";
import SigningComp from "./components/SigningComp";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const localStorageData = localStorage.getItem("myData")
    ? JSON.parse(localStorage.getItem("myData"))
    : [];
  const checkDocSigned = async (envelopId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/checkstatus?envelopId=${envelopId}`
      );
      console.log(response.data);
      console.log(response.data.results.status);
      if (response.data.results.status === "completed") {
        try {
          console.log("EnvelopID: ", envelopId);
          const response = await axios.post("http://localhost:8000/getDoc", {
            envelopeId: envelopId,
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
  return (
    <div>
      <div className="main_div">
        {!signed ? (
          <button onClick={() => setSigned(!signed)}>Sign_doc</button>
        ) : (
          <div>
            <h1 className="text-info">Docu_sign Presentation</h1>
            <br />
            <SigningComp />
          </div>
        )}
      </div>
      {loading && (
        <div className="text-primary" style={{ textAlign: "center" }}>
          Loading...
        </div>
      )}
      {localStorageData && (
        <table className="table table-bordered table-stripe mb-5 ms-5 me-5 p-5">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>EmailBody</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {localStorageData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.subject}</td>
              <td>{item.emailBody}</td>
              <td>{item.status}</td>

              <button
                onClick={() => checkDocSigned(item.id)}
                disabled={item.status == "completed" ? true : false}
              >
                Signed
              </button>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default App;
