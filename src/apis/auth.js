import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, firestoreDb, storage } from "src/firebase";

export const signup = async (data) => {
  const { username, email, password, avatar } = data;

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const storageRef = ref(storage, `avatars/${user?.uid}`);
    await uploadBytes(storageRef, avatar);
    const avatarUrl = await getDownloadURL(storageRef);

    updateProfile(user, {
      displayName: username,
      photoURL: avatarUrl,
      test: "test",
      blocked: [],
    });

    await setDoc(doc(firestoreDb, "user-information", user?.uid), {
      id: user?.uid,
      blocked: [],
      chats: [],
    });

    return {
      user,
      message: "User created successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const signin = async (data) => {
  const { email, password } = data;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    return {
      user,
      message: "User signed in successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
};
