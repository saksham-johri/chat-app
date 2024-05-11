/* eslint-disable react-hooks/exhaustive-deps */
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./_global.scss";
import { getUserData } from "./apis/firestore";
import Chat from "./components/Chat";
import Detail from "./components/Detail";
import List from "./components/List";
import Loader from "./components/Loader";
import Login from "./components/Login";
import { auth } from "./firebase";
import { updateUser } from "./redux";

const App = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state?.isLoading);
  const currentUser = useSelector((state) => state?.currentUser);

  const [showChatInfo, setShowChatInfo] = useState(false); // State to toggle visibility of chat info section

  // Check if user is logged in and fetch user data from firestore if logged in and update redux store with user data
  useEffect(() => {
    // Listener to check if user is logged in or not
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // If user is not logged in, update redux store with null
        if (!user) {
          dispatch(updateUser(null));
          return;
        }

        const data = await getUserData(user?.uid); // Fetch user data from firestore

        dispatch(updateUser(data));
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
      }
    });

    // Unsubscribe from onAuthStateChanged listener
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to toggle visibility of chat info section
  const toggleChatInfo = () => setShowChatInfo(!showChatInfo);

  return (
    <div className="mainContainer">
      {currentUser?.uid ? (
        <>
          <List />
          <Chat toggleChatInfo={toggleChatInfo} />
          {showChatInfo ? <Detail /> : null}
        </>
      ) : (
        <Login />
      )}

      {isLoading ? <Loader /> : null}
    </div>
  );
};
export default App;
