import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "src/firebase";

export const uploadAvatar = ({ uid, avatar }) =>
  new Promise((resolve, reject) => {
    const storageRef = ref(storage, `avatars/${uid}`);

    uploadBytes(storageRef, avatar)
      .then(() => getDownloadURL(storageRef))
      .then((avatarUrl) => resolve(avatarUrl))
      .catch(reject);
  });

export const uploadImage = ({ chatId, image }) =>
  new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${chatId}/${Date.now()}`);

    uploadBytes(storageRef, image)
      .then(() => getDownloadURL(storageRef))
      .then((imageUrl) => resolve(imageUrl))
      .catch(reject);
  });
