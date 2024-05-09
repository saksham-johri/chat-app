import { auth } from "src/firebase";
import "./style.scss";

const Detail = () => {
  const logout = () => {
    auth.signOut();
  };

  return (
    <div className="detail">
      <div className="user">
        <img src="./assets/avatar.png" alt="" className="user-image" />
        <h2 className="user-name">John Doe</h2>
        <p className="user-description">Lorem ipsum dolor sit abet.</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span className="title-text">Chat Settings</span>
            <img src="./assets/arrowUp.png" alt="" className="arrow" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span className="title-text">Privacy & Help</span>
            <img src="./assets/arrowUp.png" alt="" className="arrow" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span className="title-text">Shared photos</span>
            <img src="./assets/arrowUp.png" alt="" className="arrow" />
          </div>

          <div className="photo-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((item, index) => {
              return (
                <div key={index} className="item">
                  <div className="item-detail">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1671430149356-88062a82ae52?q=80&w=3175&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="image"
                    />
                    <span className="text">image_2024_01.png</span>
                  </div>

                  <img
                    src="./assets/download.png"
                    alt=""
                    className="icon-download"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span className="title-text">Shared Files</span>
            <img src="./assets/arrowUp.png" alt="" className="arrow" />
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="block">Block User</button>
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default Detail;
