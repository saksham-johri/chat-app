import { useState } from "react";

const ChatList = () => {
  const [isAddMore, setIsAddMore] = useState(false);

  const toggleAddMore = () => setIsAddMore(!isAddMore);

  return (
    <div className="chat-list">
      <div className="search">
        <div className="search-bar">
          <img src="./assets/search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>

        <img
          src={isAddMore ? "./assets/minus.png" : "./assets/plus.png"}
          alt=""
          className="plus-icon"
          onClick={toggleAddMore}
        />
      </div>

      {[1, 2, 3, 4]?.map((item, index) => (
        <div key={index} className="item">
          <img src="./assets/avatar.png" alt="" />

          <div className="texts">
            <span>John Doe</span>
            <p>Hey, how are you?</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ChatList;
