import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "src/firebase";
import { timeAgo } from "src/utils";

// Render each message in the chat
const RenderMessage = ({ data = {}, currentUserUid, selectedChat }) => {
  const { createdAt, text, senderId, imageURL } = data || {};
  const ourMessage = senderId === currentUserUid; // Check if the message is sent by the current user or not

  return (
    <div className={`messages ${ourMessage ? "own" : ""}`}>
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

        {text ? <p className="message-text">{text}</p> : null}

        <span className="last-seen">{timeAgo(new Date(createdAt))}</span>
      </div>
    </div>
  );
};

const MessageContainer = () => {
  const selectedChat = useSelector((state) => state?.selectedChat);
  const { uid: currentUserUid } = useSelector((state) => state?.currentUser);

  const endRef = useRef(null); // Reference to the last message

  const [messages, setMessages] = useState([]); // Store messages for the selected chat

  // Fetch messages for the selected chat
  useEffect(() => {
    if (!selectedChat?.chatId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, "chats", selectedChat?.chatId),
      (res) => {
        setMessages(res.data()?.messages || []);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedChat?.chatId]);

  // Scroll to the end of the chat
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.chatId, messages?.length]);

  return (
    <div className="message-container">
      {messages?.map((item) => (
        <RenderMessage
          key={item?.createdAt}
          data={item}
          currentUserUid={currentUserUid}
          selectedChat={selectedChat}
        />
      ))}

      <div ref={endRef} />
    </div>
  );
};
export default MessageContainer;
