import { useSelector } from "react-redux";
import Footer from "./Footer";
import MessageContainer from "./MessageContainer";
import UserDetails from "./UserDetails";
import "./style.scss";

const Chat = ({ toggleChatInfo }) => {
  const selectedChat = useSelector((state) => state?.selectedChat);

  if (!selectedChat?.chatId) return null;

  return (
    <div className="chat">
      <UserDetails toggleChatInfo={toggleChatInfo} />

      <MessageContainer />

      <Footer />
    </div>
  );
};
export default Chat;
