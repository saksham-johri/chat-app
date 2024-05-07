import { useState } from "react";
import { toast } from "react-toastify";
import "./style.scss";

const Login = () => {
  const [currentView, setCurrentView] = useState("sign-in");
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = ({ target: { files = [] } = {} }) => {
    if (!files.length) return;

    setAvatar({
      file: files[0],
      url: URL.createObjectURL(files[0]),
    });
  };

  const onLogin = (event) => {
    event.preventDefault();
    toast.success("Login successfully");
  };

  const onCreate = (event) => {
    event.preventDefault();
  };

  const toggleView = () => {
    setCurrentView((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
  };

  return (
    <div className="login">
      {currentView === "sign-in" ? (
        <div className="sign-in">
          <h2 className="heading">Welcome back</h2>

          <form className="form" onSubmit={onLogin}>
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="input"
            />
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="input"
            />

            <button type="submit" className="button">
              Sign In
            </button>
          </form>

          <p className="link" onClick={toggleView}>
            Signing Up ?
          </p>
        </div>
      ) : null}

      {currentView === "sign-up" ? (
        <div className="sign-up">
          <h2 className="heading">Create an Account</h2>

          <form className="form" onSubmit={onCreate}>
            <label className="label" htmlFor="file">
              <img
                className="avatar"
                src={avatar?.url || "./assets/avatar.png"}
                alt=""
              />
              Upload an Image
            </label>

            <input
              required
              className="input"
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />

            <input
              required
              className="input"
              type="text"
              name="username"
              placeholder="Username"
            />

            <input
              required
              className="input"
              type="email"
              name="email"
              placeholder="Email"
            />

            <input
              required
              className="input"
              type="password"
              name="password"
              placeholder="Password"
            />

            <button className="button" type="submit">
              Sign Up
            </button>
          </form>

          <p className="link" onClick={toggleView}>
            Signing In ?
          </p>
        </div>
      ) : null}
    </div>
  );
};
export default Login;
