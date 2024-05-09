/* eslint-disable react-hooks/exhaustive-deps */
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const isLoading = useSelector((state) => state?.isLoading);
  const currentUser = useSelector((state) => state?.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(updateUser(null));
        return;
      }

      const data = await getUserData(user?.uid);

      dispatch(updateUser(data));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="mainContainer">
      {currentUser?.uid ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}

      {isLoading ? <Loader /> : null}
    </div>
  );
};
export default App;
