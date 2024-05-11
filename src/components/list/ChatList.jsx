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

// Component to render chat item in chat list
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
  const selectedChat = useSelector((state) => state?.selectedChat);

  const [isAddMore, setIsAddMore] = useState(false); // State to toggle visibility of add more section
  const [chats, setChats] = useState([]); // State to store all chats list
  const [searchText, setSearchText] = useState(""); // State to store search text
  const [displayChats, setDisplayChats] = useState([]); // State to store chats list to display

  // Fetch all chats of current user from firestore
  useEffect(() => {
    if (!currentUser?.uid) return; // If user is not logged in, return

    // Listener to fetch all chats of current user from firestore
    const unsubscribe = onSnapshot(
      doc(firestore, "user-chats", currentUser?.uid),
      async (response) => {
        try {
          const list = response.data()?.chats || []; // Get all chats list

          // Fetch user data of all chats list
          const promises = list?.map(async (item) => {
            const { receiverId } = item || {};

            const userDocRef = doc(firestore, "users", receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data(); // Get user data

            return { ...item, user }; // Return chat data with user data
          });

          // Wait for all promises to resolve and set chats state
          const chatData = await Promise.all(promises);

          // Sort chats list by updatedAt in descending order
          setChats(
            chatData?.sort((a, b) => a?.updatedAt - b?.updatedAt)?.reverse()
          );
        } catch (error) {
          toast.error(error?.message || "Something went wrong");
        }
      }
    );

    // Unsubscribe from onSnapshot listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  // Reset search text and display chats list when chats list changes
  useEffect(() => {
    setSearchText("");
    setDisplayChats(chats);
  }, [chats]);

  // Function to toggle visibility of add more section
  const toggleAddMore = () => setIsAddMore(!isAddMore);

  // Function to mark chat as seen and set selected chat in redux store when chat is selected
  const onChatSelect = async (chatDetails) => {
    if (chatDetails?.chatId === selectedChat?.chatId) return; // If chat is already selected, return

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

  // Function to search chats list based on search text and set display chats list state
  const onSearch = debounce((value) => {
    if (!value) return setDisplayChats(chats); // If search text is empty, set display chats list as chats list

    // Filter chats list based on search text and set display chats list state
    const filteredChats = chats?.filter(
      ({ user: { displayName, email } = {} }) => {
        // Check if display name includes search text
        if (displayName.toLowerCase().includes(value.toLowerCase()))
          return true;

        // Check if email includes search text
        if (email.toLowerCase().includes(value.toLowerCase())) return true;

        return false;
      }
    );

    setDisplayChats(filteredChats); // Set display chats list state
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
