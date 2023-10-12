import React, { useState } from "react";
import axios from "axios";
import config from "./config";

const WebhookRegistration = () => {
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? config.productionUrl
      : config.localUrl;
  const handleWebhookRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/statusenveloper`);
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
