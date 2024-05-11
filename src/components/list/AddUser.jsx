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

  const [users, setUsers] = useState([]); // State to store users list

  // Function to handle form submission to find users by name/email
  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target); // Get form data
    const text = formData.get("text"); // Get text from form data

    // If text is empty, show error message and return
    if (!text) {
      setUsers([]);
      return toast.error("Please enter a name/email");
    }

    dispatch(setLoader(true));
    try {
      // Find users by name/email from firestore and update users state
      const userList = await findUsers({
        text,
        currentUserUid: currentUser?.uid,
      });

      // If no user found, show error message and return
      if (!userList?.length) {
        setUsers([]);
        return toast.error("No user found");
      }

      setUsers(userList); // Update users state with user list
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(setLoader(false));
    }
  };

  // Function to add user to chat list and create new chat
  const handleAddUser = ({ uid }) => {
    dispatch(setLoader(true));
    addNewChat({ currentUserUid: currentUser?.uid, uid })
      .then(() => {
        toast.success("User added successfully");
        toggleAddMore(); // Toggle visibility of add user section
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
