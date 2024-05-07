import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import "./_global.scss";
import Chat from "./components/Chat";
import Detail from "./components/Detail";
import List from "./components/List";
import Login from "./components/Login";
import { auth } from "./firebase";

const App = () => {
  const isLoggedIn = false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(">>> ~ user:", user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="mainContainer">
      {isLoggedIn ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};
export default App;
