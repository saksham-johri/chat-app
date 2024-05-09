import { useSelector } from "react-redux";

const UserInfo = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const { displayName, photoURL } = currentUser || {};

  return (
    <div className="user-info">
      <div className="user">
        <img
          src={photoURL ? photoURL : "./assets/avatar.png"}
          alt=""
          className="user-image"
        />
        <h2 className="user-name" title={displayName}>
          {displayName}
        </h2>
      </div>

      <div className="icon-container">
        <img src="./assets/more.png" alt="" className="icon" />
        <img src="./assets/video.png" alt="" className="icon" />
        <img src="./assets/edit.png" alt="" className="icon" />
      </div>
    </div>
  );
};
export default UserInfo;
