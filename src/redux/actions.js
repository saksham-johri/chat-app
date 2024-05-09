import { SET_LOADER, UPDATE_USER } from "./types";

export const setLoader = (isLoading) => ({
  type: SET_LOADER,
  payload: isLoading,
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});
