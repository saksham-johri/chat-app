import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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

export const getUserData = async (uid) => {
  if (!uid) {
    throw new Error("Invalid user id");
  }

  try {
    const userQuery = query(
      collection(firestore, "users"),
      where("uid", "==", uid)
    );

    const querySnapShot = await getDocs(userQuery);

    return querySnapShot?.docs[0]?.data();
  } catch (error) {
    throw new Error(error);
  }
};

export const findUsers = async (name) => {
  if (!name) {
    throw new Error("Invalid name");
  }

  try {
    const userQuery = query(
      collection(firestore, "users"),
      where("displayName", "==", name)
    );

    const querySnapShot = await getDocs(userQuery);

    if (!querySnapShot.empty) {
      return querySnapShot.docs.map((doc) => doc.data());
    }

    return [];
  } catch (error) {
    throw new Error(error);
  }
};

export const addNewChat = async ({ currentUserUid, uid }) => {
  if (!currentUserUid || !uid) {
    throw new Error("Invalid user id");
  }

  try {
    const chatRef = collection(firestore, "chats");
    const userChatRef = collection(firestore, "user-chats");

    const _chatRef = doc(chatRef);

    await setDoc(_chatRef, {
      createdAt: serverTimestamp(),
      messages: [],
    });

    await updateDoc(doc(userChatRef, uid), {
      chats: arrayUnion({
        chatId: _chatRef.id,
        receiverId: currentUserUid,
        updatedAt: Date.now(),
        lastMassage: "",
      }),
    });

    await updateDoc(doc(userChatRef, currentUserUid), {
      chats: arrayUnion({
        chatId: _chatRef.id,
        receiverId: uid,
        updatedAt: Date.now(),
        lastMassage: "",
      }),
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const sendMessage = async ({
  chatId,
  text,
  currentUserUid,
  otherUserUid,
}) => {
  if (!chatId || !text || !currentUserUid || !otherUserUid) {
    throw new Error("Invalid data");
  }

  try {
    const chatRef = doc(firestore, "chats", chatId);

    await updateDoc(chatRef, {
      messages: arrayUnion({
        text,
        senderId: currentUserUid,
        createdAt: Date.now(),
      }),
    });

    [currentUserUid, otherUserUid]?.forEach(async (uid) => {
      const userChatRef = doc(firestore, "user-chats", uid);
      const userChatsSnapshot = await getDoc(userChatRef);

      if (!userChatsSnapshot.exists()) return;

      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData?.chats?.findIndex(
        (chat) => chat.chatId === chatId
      );

      userChatsData.chats[chatIndex].lastMassage = text;
      userChatsData.chats[chatIndex].isSeen =
        uid === currentUserUid ? true : false;
      userChatsData.chats[chatIndex].updatedAt = Date.now();

      await updateDoc(userChatRef, {
        chats: userChatsData.chats,
      });
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const chatSeen = async ({ chatId, currentUserUid }) => {
  try {
    const userChatRef = doc(firestore, "user-chats", currentUserUid);
    const userChatsSnapshot = await getDoc(userChatRef);

    if (!userChatsSnapshot.exists()) return;

    const userChatsData = userChatsSnapshot.data();
    const chatIndex = userChatsData?.chats?.findIndex(
      (chat) => chat.chatId === chatId
    );

    userChatsData.chats[chatIndex].isSeen = true;

    await updateDoc(userChatRef, {
      chats: userChatsData.chats,
    });
  } catch (error) {
    throw new Error(error);
  }
};
