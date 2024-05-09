import {
  SET_LOADER,
  SET_SELECTED_CHAT,
  TOGGLE_BLOCK,
  UPDATE_USER,
} from "./types";

const initialState = {
  isLoading: false,
  currentUser: null,
  selectedChat: {
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
  },
};

const _getSelectedChat = ({
  data: { chatId, user } = {},
  state: { currentUser = {} } = {},
}) => {
  // Check if the current user is blocked
  if (user?.blocked?.includes(currentUser?.uid)) {
    return {
      chatId,
      user: null,
      isCurrentUserBlocked: true,
      isReceiverBlocked: false,
    };
  }

  // Check if the receiver is blocked
  if (currentUser?.blocked?.includes(user?.uid)) {
    return {
      chatId,
      user: user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: true,
    };
  }

  return {
    chatId,
    user,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
  };
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

    case SET_SELECTED_CHAT: {
      return {
        ...state,
        selectedChat: _getSelectedChat({ data: payload, state }),
      };
    }

    case TOGGLE_BLOCK:
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          isReceiverBlocked: !state.selectedChat.isReceiverBlocked,
        },
      };

    default:
      return state;
  }
};
