import {
  SET_LOADER,
  SET_SELECTED_CHAT,
  TOGGLE_BLOCK,
  UPDATE_USER,
} from "./types";

export const setLoader = (isLoading) => ({
  type: SET_LOADER,
  payload: isLoading,
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

export const setSelectedChat = (chatDetails) => ({
  type: SET_SELECTED_CHAT,
  payload: chatDetails,
});

export const toggleBlock = () => ({
  type: TOGGLE_BLOCK,
});
