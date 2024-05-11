import EmojiPicker from "emoji-picker-react";
import EmojiIcon from "public/assets/emoji.svg?react";
import ImageIcon from "public/assets/image.svg?react";
import SendIcon from "public/assets/send.svg?react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendMessage } from "src/apis/firestore";
import { setLoader } from "src/redux";

const Footer = () => {
  const dispatch = useDispatch();

  const { uid: currentUserUid } = useSelector((state) => state?.currentUser);
  const selectedChat = useSelector((state) => state?.selectedChat);
  const { isCurrentUserBlocked, isReceiverBlocked } = selectedChat || {};

  const imageRef = useRef(null); // Image input reference

  const [input, setInput] = useState(""); // Input value
  const [isOpen, setIsOpen] = useState(false); // Emoji picker visibility

  // Update the input value on change
  const handleOnInputChange = ({ target: { value } = {} }) => {
    setInput(value);
  };

  // Toggle the emoji picker visibility
  const toggleEmoji = () => setIsOpen(!isOpen);

  //  Add emoji to the input
  const onEmojiClick = ({ emoji }) => {
    setInput((input) => input + emoji);
    toggleEmoji(); // Close the emoji picker
  };

  //   Send text message to the selected chat
  const onSend = () => {
    if (!input) return; // If no input is there, return

    // Send the message to the selected chat
    sendMessage({
      chatId: selectedChat?.chatId,
      text: input?.trim(),
      currentUserUid: currentUserUid,
      otherUserUid: selectedChat?.user?.uid,
    })
      .then(() => {
        setInput(""); // Reset the input value
      })
      .catch((error) => {
        toast.error(error.message || "Failed to send message");
      });
  };

  // Send image message to the selected chat
  const uploadImage = ({ target: { files = [] } = {} }) => {
    const image = files[0]; // Get the first image from the selected files

    if (!image) return; // If no image is selected, return

    const formData = new FormData();
    formData.append("image", image); // Append the image to FormData

    const data = Object.fromEntries(formData.entries()); // Convert FormData to object

    dispatch(setLoader(true));
    // Send the image to the selected chat
    sendMessage({
      chatId: selectedChat?.chatId,
      text: null,
      currentUserUid: currentUserUid,
      otherUserUid: selectedChat?.user?.uid,
      image: data?.image,
    })
      .then(() => {
        imageRef.current.value = null; // Reset the input value
      })
      .catch((error) => {
        toast.error(error.message || "Failed to send message");
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <div className="footer">
      <label htmlFor="image">
        <ImageIcon
          className="icon"
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
      </label>

      <input
        disabled={isCurrentUserBlocked || isReceiverBlocked}
        ref={imageRef}
        type="file"
        id="image"
        accept="image/*"
        style={{ display: "none" }}
        onChange={uploadImage}
      />

      <input
        autoFocus
        disabled={isCurrentUserBlocked || isReceiverBlocked}
        type="text"
        placeholder="Type a message..."
        className="input"
        value={input}
        onChange={handleOnInputChange}
        onKeyDown={(event) => {
          const { code } = event || {};

          if (code === "Enter") onSend();
        }}
      />

      <div className="emoji">
        <EmojiIcon
          className="icon"
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          onClick={toggleEmoji}
        />

        <div className="emoji-picker">
          <EmojiPicker theme="dark" open={isOpen} onEmojiClick={onEmojiClick} />
        </div>
      </div>

      <SendIcon
        className="icon send"
        disabled={isCurrentUserBlocked || isReceiverBlocked}
        onClick={onSend}
      />
    </div>
  );
};
export default Footer;
