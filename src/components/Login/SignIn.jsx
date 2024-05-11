import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { signin } from "src/apis/auth";
import { setLoader } from "src/redux";

const SignIn = ({ toggleView = () => {} }) => {
  const dispatch = useDispatch();

  const onLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event?.target);
    const data = Object.fromEntries(formData.entries());

    dispatch(setLoader(true));
    signin(data)
      .then((response) => {
        toast.success(response?.message);
      })
      .catch((error) => {
        toast.error(error?.message);
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <div className="sign-in">
      <h2 className="heading">Welcome back</h2>

      <form className="form" onSubmit={onLogin}>
        <input
          required
          defaultValue="email@email.com"
          type="email"
          name="email"
          placeholder="Email"
          className="input"
        />
        <input
          required
          defaultValue="Password@123"
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
  );
};
export default SignIn;
