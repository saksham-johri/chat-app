import "./style.scss";

const AddUser = () => {
  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="add-user">
      <form className="form" onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input"
        />

        <button type="submit" className="button">
          Search
        </button>
      </form>

      <div className="user-container">
        <div className="user">
          <div className="user-detail">
            <img src="./assets/avatar.png" alt="" className="user-image" />
            <span className="user-name">Username</span>
          </div>

          <button className="add">Add User</button>
        </div>
      </div>
    </div>
  );
};
export default AddUser;
