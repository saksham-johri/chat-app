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
      const userList = await findUsers(text);
      const filteredList = userList?.filter(
        ({ uid }) => uid !== currentUser?.uid
      );

      if (!filteredList?.length) {
        setUsers([]);
        return toast.error("No user found");
      }

      setUsers(filteredList);
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
    <div className="add-user">
      <form className="form" onSubmit={onSubmit}>
        <input
          type="text"
          name="text"
          placeholder="Type Here..."
          className="input"
        />

        <button type="submit" className="button">
          Search
        </button>
      </form>

      {users?.length ? (
        <div className="user-container">
          {users?.map(({ uid, displayName, photoURL, email }) => (
            <div key={uid} className="user">
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

              <button className="add" onClick={() => handleAddUser({ uid })}>
                Add User
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default AddUser;
