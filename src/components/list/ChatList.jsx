import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { firestore } from "src/firebase";
import AddUser from "./AddUser";

const ChatList = () => {
  const currentUser = useSelector((state) => state?.currentUser);

  const [isAddMore, setIsAddMore] = useState(false);
  const [chats, setChats] = useState([]);

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

          setChats(chatData?.sort((a, b) => a?.updatedAt > b?.updatedAt));
        } catch (error) {
          toast.error(error?.message || "Something went wrong");
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  const toggleAddMore = () => setIsAddMore(!isAddMore);

  return (
    <div className="chat-list">
      <div className="search">
        <div className="search-bar">
          <img src="./assets/search.png" alt="" className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>

        <img
          src={isAddMore ? "./assets/minus.png" : "./assets/plus.png"}
          alt=""
          className="add-more-icon"
          onClick={toggleAddMore}
        />
      </div>

      <div className="item-container">
        {chats?.map(
          ({ chatId, lastMassage, user: { displayName, photoURL } = {} }) => (
            <div key={chatId} className="item">
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
          )
        )}
      </div>

      {isAddMore ? <AddUser toggleAddMore={toggleAddMore} /> : null}
    </div>
  );
};
export default ChatList;
