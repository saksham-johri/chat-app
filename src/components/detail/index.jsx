import { useSelector } from "react-redux";
import Footer from "./Footer";
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

      <Footer />
    </div>
  );
};
export default Detail;
