const UserInfo = () => {
  return (
    <div className="user-info">
      <div className="user">
        <img src="./assets/avatar.png" alt="" className="user-image" />
        <h2 className="user-name">John Doe</h2>
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
