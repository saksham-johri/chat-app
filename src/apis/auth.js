import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "src/firebase";
import { setUserInitialData } from "./firestore";
import { uploadAvatar } from "./storage";

export const signup = async (data) => {
  const { displayName, email, password, avatar } = data;

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const photoURL = await uploadAvatar({ uid: user?.uid, avatar });

    updateProfile(user, {
      displayName: displayName,
      photoURL,
    });

    await setUserInitialData({
      uid: user?.uid,
      email,
      displayName,
      photoURL,
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
