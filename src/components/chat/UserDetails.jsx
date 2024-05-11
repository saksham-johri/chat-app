import InfoIcon from "public/assets/info.svg?react";
import { useSelector } from "react-redux";

const UserDetails = ({ toggleChatInfo = () => {} }) => {
  const { user } = useSelector((state) => state?.selectedChat);
  const { photoURL = null, displayName = "User Not Found" } = user || {};

  return (
    <div className="user-details">
      <div className="user">
        <img
          src={photoURL ? photoURL : "./assets/avatar.png"}
          alt=""
          className="user-image"
        />
        <p className="name">{displayName}</p>
      </div>

      <InfoIcon className="info" onClick={toggleChatInfo} />
    </div>
  );
};
export default UserDetails;
