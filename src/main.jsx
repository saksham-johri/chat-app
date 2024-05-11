import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="bottom-right"
        theme="colored"
        pauseOnFocusLoss={false}
      />
    </Provider>
  </>
);
