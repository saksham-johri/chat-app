import { useSelector } from "react-redux";
import SharedPhotos from "./SharedPhotos";
import User from "./User";
import "./style.scss";

const Detail = () => {
  const { chatId } = useSelector((state) => state?.selectedChat);

  if (!chatId) return null;

  return (
    <div className="detail">
      <User />

      <SharedPhotos />

      <div className="footer">
        <button className="block">Block User</button>
      </div>
    </div>
  );
};
export default Detail;
