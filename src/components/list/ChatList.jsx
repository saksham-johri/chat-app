import { useState } from "react";
import AddUser from "./AddUser";

const ChatList = () => {
  const [isAddMore, setIsAddMore] = useState(false);

  const toggleAddMore = () => setIsAddMore(!isAddMore);

  return (
    <div className="chat-list">
      <div className="search">
        <div className="search-bar">
          <img src="./assets/search.png" alt="" className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>

        <img
          src={isAddMore ? "./assets/minus.png" : "./assets/plus.png"}
          alt=""
          className="add-more-icon"
          onClick={toggleAddMore}
        />
      </div>

      <div className="item-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((item, index) => (
          <div key={index} className="item">
            <img src="./assets/avatar.png" alt="" className="item-image" />

            <div className="texts">
              <span className="name">John Doe</span>
              <p className="message">Hey, how are you?</p>
            </div>
          </div>
        ))}
      </div>

      {isAddMore ? <AddUser /> : null}
    </div>
  );
};
export default ChatList;
