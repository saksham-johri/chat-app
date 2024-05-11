import {
  SET_LOADER,
  SET_SELECTED_CHAT,
  TOGGLE_BLOCK,
  UPDATE_USER,
} from "./types";

// Set the loader state to show/hide loader
export const setLoader = (isLoading) => ({
  type: SET_LOADER,
  payload: isLoading,
});

// Update the user state with the user data
export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

// Set the selected chat state with the chat details
export const setSelectedChat = (chatDetails) => ({
  type: SET_SELECTED_CHAT,
  payload: chatDetails,
});

// Toggle the block state to block/unblock the user in the chat
export const toggleBlock = () => ({
  type: TOGGLE_BLOCK,
});
