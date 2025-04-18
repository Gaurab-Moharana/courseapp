import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";
import App from "./App.jsx";
const stripePromise = loadStripe(
  "pk_test_51R80B7ChT5wW9As7qXE4K9uOTJOimQGa0aDr6lacTlPySDmSyoIgMSGAKbwGjtkJmCpCyBUTjeVQgtpXamnlXAx500ZJPDNMMe"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
