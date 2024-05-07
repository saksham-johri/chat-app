import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "./style.scss";

const Login = () => {
  const [currentView, setCurrentView] = useState("sign-in");

  const toggleView = () => {
    setCurrentView((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
  };

  return (
    <div className="login">
      {currentView === "sign-in" ? <SignIn toggleView={toggleView} /> : null}

      {currentView === "sign-up" ? <SignUp toggleView={toggleView} /> : null}
    </div>
  );
};
export default Login;
