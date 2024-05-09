import { doc, setDoc } from "firebase/firestore";
import { firestore } from "src/firebase";

export const setUserInitialData = async ({
  uid,
  email,
  displayName,
  photoURL,
}) => {
  try {
    const userChatRef = doc(firestore, "user-chats", uid);
    const userRef = doc(firestore, "users", uid);

    await setDoc(userChatRef, {
      chats: [],
    });

    await setDoc(userRef, {
      uid,
      email,
      displayName,
      photoURL,
      blocked: [],
    });
  } catch (error) {
    throw new Error(error);
  }
};
