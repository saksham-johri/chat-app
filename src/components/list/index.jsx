import ChatList from "./ChatList";
import UserInfo from "./UserInfo";
import "./style.scss";

const List = () => {
  return (
    <div className="list">
      <UserInfo />

      <ChatList />
    </div>
  );
};
export default List;
