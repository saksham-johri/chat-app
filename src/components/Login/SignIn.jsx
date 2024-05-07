import { useState } from "react";
import { toast } from "react-toastify";
import { signin } from "src/apis/auth";
import Loader from "../Loader";

const SignIn = ({ toggleView = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event?.target);
    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);
    signin(data)
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

      {isLoading ? <Loader /> : null}
    </>
  );
};
export default SignIn;
