import Logout from "public/assets/logout.svg?react";
import { useSelector } from "react-redux";
import { auth } from "src/firebase";

const UserInfo = () => {
  const { displayName, photoURL } = useSelector((state) => state.currentUser);

  // Function to logout user
  const logout = () => {
    auth.signOut();
  };

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

      <Logout className="logout" onClick={logout} />
    </div>
  );
};
export default UserInfo;
