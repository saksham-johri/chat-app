import { useSelector } from "react-redux";

const User = () => {
  const { user: { photoURL, displayName, email } = {} } = useSelector(
    (state) => state?.selectedChat
  );

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
