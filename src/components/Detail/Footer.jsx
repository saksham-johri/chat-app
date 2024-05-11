import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { blockUser } from "src/apis/firestore";
import { setLoader, toggleBlock } from "src/redux";

const Footer = () => {
  const dispatch = useDispatch();

  const { user, isCurrentUserBlocked, isReceiverBlocked } = useSelector(
    (state) => state.selectedChat
  );
  const currentUser = useSelector((state) => state.currentUser);

  const handleOnBlock = () => {
    dispatch(setLoader(true));
    blockUser({
      currentUserUid: currentUser?.uid,
      otherUserUid: user?.uid,
      isReceiverBlocked: isReceiverBlocked,
    })
      .then(() => {
        // Toggle the block state
        dispatch(toggleBlock());
      })
      .catch((error) => {
        toast.error(error.message || "Failed to block the user");
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <div className="footer">
      {isCurrentUserBlocked ? (
        <div className="blocked">You ae blocked</div>
      ) : (
        <button className="block" onClick={handleOnBlock}>
          {isReceiverBlocked ? "Unblock User" : "Block User"}
        </button>
      )}
    </div>
  );
};
export default Footer;
