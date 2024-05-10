import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendMessage } from "src/apis/firestore";
import { firestore } from "src/firebase";
import "./style.scss";

const Chat = () => {
  const selectedChat = useSelector((state) => state?.selectedChat);
  const { uid: currentUserUid } = useSelector((state) => state?.currentUser);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!selectedChat?.chatId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, "chats", selectedChat?.chatId),
      (res) => {
        setData(res.data());
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedChat?.chatId]);

  const toggleEmoji = () => setIsOpen(!isOpen);

  const handleOnInputChange = ({ target: { value } = {} }) => {
    setInput(value);
  };

  const onEmojiClick = ({ emoji }) => {
    setInput((input) => input + emoji);
    toggleEmoji();
  };

  const onSend = () => {
    if (!input) return;

    sendMessage({
      chatId: selectedChat?.chatId,
      text: input?.trim(),
      currentUserUid: currentUserUid,
      otherUserUid: selectedChat?.user?.uid,
    })
      .then(() => {
        setInput("");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to send message");
      });
  };

  if (!selectedChat?.chatId) return null;

  return (
    <div className="chat">
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
          <div className="texts">
            <span className="name">{selectedChat?.user?.displayName}</span>
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
        {data?.messages?.map(
          ({ createdAt, text, senderId, image: imageURL }) => {
            const ourMessage = senderId === currentUserUid;

            return (
              <div
                key={createdAt}
                className={`messages ${ourMessage ? "own" : ""}`}
              >
                {ourMessage ? null : (
                  <img
                    className="user-img"
                    src={
                      selectedChat?.user?.photoURL
                        ? selectedChat?.user?.photoURL
                        : "./assets/avatar.png"
                    }
                    alt=""
                  />
                )}

                <div className="texts">
                  {imageURL ? (
                    <img className="message-img" src={imageURL} alt="" />
                  ) : null}

                  <p className="message-text">{text}</p>

                  <span className="last-seen">1 min ago</span>
                </div>
              </div>
            );
          }
        )}

        <div ref={endRef} />
      </div>

      <div className="footer">
        <div className="icon-container">
          <img src="./assets/img.png" alt="" className="icon" />
          <img src="./assets/camera.png" alt="" className="icon" />
          <img src="./assets/mic.png" alt="" className="icon" />
        </div>

        <input
          autoFocus
          type="text"
          placeholder="Type a message..."
          className="input"
          value={input}
          onChange={handleOnInputChange}
          onKeyDown={(event) => {
            const { code } = event || {};

            if (code === "Enter") onSend();
          }}
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

        <button className="send-btn" onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
