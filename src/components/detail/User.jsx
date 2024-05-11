import { useSelector } from "react-redux";

const User = () => {
  const { user = {} } = useSelector((state) => state.selectedChat);
  const {
    photoURL = null,
    displayName = "User Not Found",
    email = "Invalid Id",
  } = user || {};

  return (
    <div className="user">
      <img
        src={photoURL ? photoURL : "./assets/avatar.png"}
        alt=""
        className="user-image"
      />

      <div className="text">
        <h2 className="name">{displayName}</h2>
        <p className="email">{email}</p>
      </div>
    </div>
  );
};
export default User;
