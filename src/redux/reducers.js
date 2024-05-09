import { SET_LOADER, UPDATE_USER } from "./types";

const initialState = {
  isLoading: false,
  currentUser: null,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };

    case UPDATE_USER:
      return {
        ...state,
        currentUser: payload,
      };

    default:
      return state;
  }
};
