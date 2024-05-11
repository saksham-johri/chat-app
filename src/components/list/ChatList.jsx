import { doc, getDoc, onSnapshot } from "firebase/firestore";
import AddIcon from "public/assets/add.svg?react";
import Minus from "public/assets/minus.svg?react";
import SearchIcon from "public/assets/search.svg?react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { chatSeen } from "src/apis/firestore";
import { firestore } from "src/firebase";
import { setLoader, setSelectedChat } from "src/redux";
import { debounce } from "src/utils";
import AddUser from "./AddUser";

const RenderChatItem = ({ data = {}, onClick = () => {} }) => {
  const {
    chatId,
    lastMassage,
    isSeen,
    user: { displayName, photoURL } = {},
  } = data || {};

  const selectedChat = useSelector((state) => state?.selectedChat);

  return (
    <div
      key={chatId}
      className={`item ${!isSeen ? "not-seen" : ""} ${
        chatId === selectedChat?.chatId ? "selected" : ""
      }`}
      onClick={() => onClick(data)}
    >
      <img
        src={photoURL ? photoURL : "./assets/avatar.png"}
        alt=""
        className="item-image"
      />

      <div className="texts">
        <span className="name">{displayName}</span>
        <p className="message">{lastMassage}</p>
      </div>
    </div>
  );
};

const ChatList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.currentUser);

  const [isAddMore, setIsAddMore] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [displayChats, setDisplayChats] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = onSnapshot(
      doc(firestore, "user-chats", currentUser?.uid),
      async (response) => {
        try {
          const list = response.data()?.chats || [];

          const promises = list?.map(async (item) => {
            const { receiverId } = item || {};

            const userDocRef = doc(firestore, "users", receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data();

            return { ...item, user };
          });

          const chatData = await Promise.all(promises);

          setChats(
            chatData?.sort((a, b) => a?.updatedAt - b?.updatedAt)?.reverse()
          );
        } catch (error) {
          toast.error(error?.message || "Something went wrong");
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    setSearchText("");
    setDisplayChats(chats);
  }, [chats]);

  const toggleAddMore = () => setIsAddMore(!isAddMore);

  const onChatSelect = async (chatDetails) => {
    dispatch(setLoader(true));
    try {
      await chatSeen({
        chatId: chatDetails?.chatId,
        currentUserUid: currentUser?.uid,
      });
      dispatch(setSelectedChat(chatDetails));
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(setLoader(false));
    }
  };

  const onSearch = debounce((value) => {
    if (!value) return setDisplayChats(chats);

    const filteredChats = chats?.filter(
      ({ user: { displayName, email } = {} }) => {
        if (displayName.toLowerCase().includes(value.toLowerCase()))
          return true;

        if (email.toLowerCase().includes(value.toLowerCase())) return true;

        return false;
      }
    );

    setDisplayChats(filteredChats);
  }, 500);

  return (
    <div className="chat-list">
      <div className="search">
        <div className="search-bar">
          <SearchIcon className="search-icon" />
          <input
            type="search"
            placeholder="Search"
            className="search-input"
            value={searchText}
            onChange={({ target: { value = "" } = {} }) => {
              onSearch(value);
              setSearchText(value);
            }}
          />
        </div>

        {isAddMore ? (
          <Minus className="add-more-icon" onClick={toggleAddMore} />
        ) : (
          <AddIcon className="add-more-icon" onClick={toggleAddMore} />
        )}
      </div>

      <div className="item-container">
        {displayChats?.map((chatDetails) => (
          <RenderChatItem
            key={chatDetails?.chatId}
            data={chatDetails}
            onClick={onChatSelect}
          />
        ))}
      </div>

      {isAddMore ? <AddUser toggleAddMore={toggleAddMore} /> : null}
    </div>
  );
};
export default ChatList;
