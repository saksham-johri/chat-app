import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./reducers";

const rootReducer = (state, action) => {
  //   if (action.type === USER_LOGOUT) {
  //     sessionStorage.clear();
  //     return applicationReducer(undefined, action);
  //   }

  return reducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
