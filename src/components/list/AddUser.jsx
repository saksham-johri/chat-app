import AddNewUserIcon from "public/assets/add-new-user.svg?react";
import CancelIcon from "public/assets/cancel.svg?react";
import SearchFolderIcon from "public/assets/search-folder.svg?react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addNewChat, findUsers } from "src/apis/firestore";
import { setLoader } from "src/redux";
import "./style.scss";

const AddUser = ({ toggleAddMore = () => {} }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state?.currentUser);

  const [users, setUsers] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const text = formData.get("text");

    if (!text) {
      setUsers([]);
      return toast.error("Please enter a name/email");
    }

    dispatch(setLoader(true));
    try {
      const userList = await findUsers({
        text,
        currentUserUid: currentUser?.uid,
      });

      if (!userList?.length) {
        setUsers([]);
        return toast.error("No user found");
      }

      setUsers(userList);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(setLoader(false));
    }
  };

  const handleAddUser = ({ uid }) => {
    dispatch(setLoader(true));
    addNewChat({ currentUserUid: currentUser?.uid, uid })
      .then(() => {
        toast.success("User added successfully");
        toggleAddMore();
      })
      .catch((error) => {
        toast.error(error?.message || "Something went wrong");
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <div className="add-user-container">
      <div className="add-user">
        <form className="form" onSubmit={onSubmit}>
          <input
            autoFocus
            type="text"
            name="text"
            placeholder="Type Here..."
            className="input"
          />

          <button type="submit" className="button">
            <SearchFolderIcon className="search-btn" />
          </button>

          <CancelIcon className="cancel" onClick={toggleAddMore} />
        </form>

        {users?.length ? (
          <div className="user-container">
            {users?.map(
              ({ uid, displayName, photoURL, email, isChatExist }) => (
                <div key={uid} className={`user ${isChatExist ? "exist" : ""}`}>
                  <div className="user-detail">
                    <img
                      src={photoURL ? photoURL : "./assets/avatar.png"}
                      alt=""
                      className="user-image"
                    />

                    <div className="text">
                      <span className="user-name">{displayName}</span>
                      <span className="user-email">{email}</span>
                    </div>
                  </div>

                  <AddNewUserIcon
                    className="add"
                    onClick={() =>
                      isChatExist ? null : handleAddUser({ uid })
                    }
                  />
                </div>
              )
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default AddUser;
