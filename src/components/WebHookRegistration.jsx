import React, { useState } from "react";
import axios from "axios";

const WebhookRegistration = () => {
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWebhookRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/statusenveloper");
      console.log(response.data);
      //   if (response.status === 201) {
      //     setRegistrationStatus("Webhook registered successfully");
      //   } else {
      //     setRegistrationStatus("Failed to register webhook");
      //   }
    } catch (error) {
      console.error("Error registering webhook:", error);
      setRegistrationStatus("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleWebhookRegistration} disabled={loading}>
        Register Webhook
      </button>
      {loading && <p>Registering...</p>}
      {registrationStatus && <p>{registrationStatus}</p>}
    </div>
  );
};

export default WebhookRegistration;
