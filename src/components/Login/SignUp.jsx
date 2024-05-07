import { useState } from "react";
import { toast } from "react-toastify";
import { signup } from "src/apis/auth";
import Loader from "../Loader";

const SignUp = ({ toggleView = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const onCreate = (event) => {
    event.preventDefault();

    const formData = new FormData(event?.target);
    if (avatar?.file) formData.append("avatar", avatar?.file);

    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);
    signup(data)
      .then((response) => {
        toast.success(response?.message);
      })
      .catch((error) => {
        toast.error(error?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
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

      {isLoading ? <Loader /> : null}
    </>
  );
};
export default SignUp;
