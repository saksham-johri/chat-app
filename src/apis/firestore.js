import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "src/firebase";
import { uploadImage } from "./storage";

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

export const findUsers = async ({ text, currentUserUid }) => {
  if (!text) {
    throw new Error("Invalid name");
  }

  try {
    const userQuery = query(
      collection(firestore, "users"),
      or(where("displayName", "==", text), where("email", "==", text))
    );

    const querySnapShot = await getDocs(userQuery);

    if (querySnapShot.empty) {
      return [];
    }

    const data = querySnapShot.docs
      .map((doc) => doc.data())
      ?.filter(({ uid }) => uid !== currentUserUid); // Remove current user from list

    const res = (await getDoc(doc(firestore, "user-chats", currentUserUid)))
      .data()
      ?.chats?.map(({ receiverId }) => receiverId);

    data?.forEach((item) => {
      if (res?.includes(item.uid)) {
        item.isChatExist = true;
      }
    });

    return data;
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
  image,
}) => {
  if (!chatId || !currentUserUid || !otherUserUid) {
    throw new Error("Invalid data");
  }

  try {
    const chatRef = doc(firestore, "chats", chatId);

    const messageContent = {
      text,
      senderId: currentUserUid,
      createdAt: Date.now(),
    };

    if (image) {
      const imageURL = await uploadImage({ chatId, image });
      messageContent.imageURL = imageURL;
    }

    await updateDoc(chatRef, {
      messages: arrayUnion(messageContent),
    });

    [currentUserUid, otherUserUid]?.forEach(async (uid) => {
      const userChatRef = doc(firestore, "user-chats", uid);
      const userChatsSnapshot = await getDoc(userChatRef);

      if (!userChatsSnapshot.exists()) return;

      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData?.chats?.findIndex(
        (chat) => chat.chatId === chatId
      );

      userChatsData.chats[chatIndex].lastMassage = image ? "📷 Image" : text;
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

export const blockUser = async ({
  currentUserUid,
  otherUserUid,
  isReceiverBlocked,
}) => {
  try {
    const userRef = doc(firestore, "users", currentUserUid);

    await updateDoc(userRef, {
      blocked: isReceiverBlocked
        ? arrayRemove(otherUserUid)
        : arrayUnion(otherUserUid),
    });
  } catch (error) {
    throw new Error(error);
  }
};
