import InfoIcon from "public/assets/info.svg?react";
import { useSelector } from "react-redux";

const UserDetails = ({ toggleChatInfo = () => {} }) => {
  const selectedChat = useSelector((state) => state?.selectedChat);

  return (
    <div className="user-details">
      <div className="user">
        <img
          src={
            selectedChat?.user?.photoURL
              ? selectedChat?.user?.photoURL
              : "./assets/avatar.png"
          }
          alt=""
          className="user-image"
        />
        <p className="name">{selectedChat?.user?.displayName}</p>
      </div>

      <InfoIcon className="info" onClick={toggleChatInfo} />
    </div>
  );
};
export default UserDetails;
