import { doc, onSnapshot } from "firebase/firestore";
import DownloadIcon from "public/assets/download.svg?react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "src/firebase";

const SharedPhotos = () => {
  const { chatId } = useSelector((state) => state?.selectedChat);

  const [photoURLs, setPhotoURLs] = useState([]); // State to store photo URLs

  // Fetch photo URLs from firestore and update state
  useEffect(() => {
    if (!chatId) return; // Return if chatId is not present

    // Listener to fetch photo URLs from firestore
    const unsubscribe = onSnapshot(doc(firestore, "chats", chatId), (res) => {
      const urls = res
        .data()
        ?.messages?.map(({ imageURL }) => imageURL) // Extract imageURL from messages
        ?.filter((url) => url); // Filter out null values

      setPhotoURLs(urls); // Update state with photo URLs
    });

    // Unsubscribe from listener
    return () => {
      unsubscribe();
    };
  }, [chatId]);

  // Function to download image
  const downloadImage = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "image";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div className="shared-photo-container">
      <div className="title-container">
        <p className="title">Shared Photos</p>
      </div>

      <div className="photo-container">
        {photoURLs?.map((url, index) => {
          return (
            <div key={index} className="item">
              <img src={url} alt="" className="image" />

              <DownloadIcon
                className="download-icon"
                onClick={() => downloadImage(url)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SharedPhotos;
