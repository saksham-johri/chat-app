import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addNewChat, findUsers } from "src/apis/firestore";
import "./style.scss";

const AddUser = ({ toggleAddMore = () => {} }) => {
  const currentUser = useSelector((state) => state?.currentUser);

  const [users, setUsers] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");

    try {
      const userList = await findUsers(name);
      setUsers(userList);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleAddUser = ({ uid }) => {
    addNewChat({ currentUserUid: currentUser?.uid, uid })
      .then(() => {
        toast.success("User added successfully");
        toggleAddMore();
      })
      .catch((error) => {
        toast.error(error?.message || "Something went wrong");
      });
  };

  return (
    <div className="add-user">
      <form className="form" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Type Here..."
          className="input"
        />

        <button type="submit" className="button">
          Search
        </button>
      </form>

      <div className="user-container">
        {users?.map(({ uid, displayName, photoURL }) => (
          <div key={uid} className="user">
            <div className="user-detail">
              <img
                src={photoURL ? photoURL : "./assets/avatar.png"}
                alt=""
                className="user-image"
              />
              <span className="user-name">{displayName}</span>
            </div>

            <button className="add" onClick={() => handleAddUser({ uid })}>
              Add User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AddUser;
