import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import "./style.scss";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
      <div className="user-details">
        <div className="user">
          <img src="./assets/avatar.png" alt="" className="user-image" />
          <div className="texts">
            <span className="name">John Doe</span>
            <p className="about">Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        <div className="icon-container">
          <img src="./assets/phone.png" alt="" className="icon" />
          <img src="./assets/video.png" alt="" className="icon" />
          <img src="./assets/info.png" alt="" className="icon" />
        </div>
      </div>

      <div className="message-container">
        {[1, 2, 3, 4, 5, 6, 7]?.map((item, index) => {
          const ourMessage = index % 2;
          const isImage = index % 3;

          return (
            <div key={index} className={`messages ${ourMessage ? "own" : ""}`}>
              {ourMessage ? null : (
                <img className="user-img" src="./assets/avatar.png" alt="" />
              )}

              <div className="texts">
                {isImage ? (
                  <img
                    className="message-img"
                    src="https://plus.unsplash.com/premium_photo-1671430149356-88062a82ae52?q=80&w=3175&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                ) : null}

                <p className="message-text">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Aliquam neque tenetur molestiae possimus libero necessitatibus
                  ut laudantium, vero optio eum!
                </p>

                <span className="last-seen">1 min ago</span>
              </div>
            </div>
          );
        })}

        <div ref={endRef} />
      </div>

      <div className="footer">
        <div className="icon-container">
          <img src="./assets/img.png" alt="" className="icon" />
          <img src="./assets/camera.png" alt="" className="icon" />
          <img src="./assets/mic.png" alt="" className="icon" />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          className="input"
          value={input}
          onChange={handleOnInputChange}
        />

        <div className="emoji">
          <img
            src="./assets/emoji.png"
            alt=""
            onClick={toggleEmoji}
            className="icon"
          />

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
