import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import "./style.scss";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const toggleEmoji = () => setIsOpen(!isOpen);

  const handleOnInputChange = ({ target: { value } = {} }) => {
    setInput(value);
  };

  const onEmojiClick = ({ emoji }) => {
    setInput((input) => input + emoji);
    toggleEmoji();
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./assets/avatar.png" alt="" />
          <div className="texts">
            <span>John Doe</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        <div className="icons">
          <img src="./assets/phone.png" alt="" />
          <img src="./assets/video.png" alt="" />
          <img src="./assets/info.png" alt="" />
        </div>
      </div>

      <div className="center"></div>

      <div className="bottom">
        <div className="icons">
          <img src="./assets/img.png" alt="" />
          <img src="./assets/camera.png" alt="" />
          <img src="./assets/mic.png" alt="" />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          className="input"
          value={input}
          onChange={handleOnInputChange}
        />

        <div className="emoji">
          <img src="./assets/emoji.png" alt="" onClick={toggleEmoji} />

          <div className="emoji-picker">
            <EmojiPicker open={isOpen} onEmojiClick={onEmojiClick} />
          </div>
        </div>

        <button className="send-btn">Send</button>
      </div>
    </div>
  );
};
export default Chat;
