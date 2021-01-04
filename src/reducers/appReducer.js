import actionType from "../constants";

const initialAppState = {
  userSignin: {
    userInfo: {},
    error: "",
    isLogin: false,
  },
  itemsInfo: {
    items: [],
    loading: false,
    error: "",
  },
  borrowInfo: {
    borrowItems: [],
    borrowLoading: false,
    borrowError: "",
  }
};

let borrowItems = {};
const appReducer = (state, action) => {
  switch (action.type) {
    case actionType.USER_INIT_INFO:
      return {
        ...state,
        userSignin: {
          ...state.userSignin,
          userInfo: action.payload,
        },
      };
    case actionType.USER_SIGNIN_SUCCESS:
      return {
        ...state,
        userSignin: {
          ...state.userSignin,
          userInfo: action.payload,
          isLogin: true,
        },
      };
    case actionType.USER_SIGNIN_FAIL:
      return {
        ...state,
        userSignin: {
          ...state.userSignin,
          error: action.payload,
        },
      };
    case actionType.USER_LOGOUT:
      return {
        ...state,
        userSignin: {
          ...state.userSignin,
          userInfo: {},
          isLogin: false,
        },
      };
    // case actionType.USER_UPDATE_RESERVED:
    //   return {
    //     ...state,
    //     userSignin: {
    //       ...state.userSignin,
    //       userInfo: action.payload,
    //     },
    //   };

    case actionType.ITEM_LIST_REQUEST:
      return {
        ...state,
        itemsInfo: { ...state.itemsInfo, loading: true }
      };
    case actionType.ITEM_LIST_SUCCESS:
      return {
        ...state,
        itemsInfo: { ...state.itemsInfo, items: action.payload, loading: false },
      };
    case actionType.ITEM_LIST_FAIL:
      return {
        ...state,
        itemsInfo: { ...state.itemsInfo, error: action.payload, loading: false },
      };

    case actionType.ITEM_DETAILS_UPDATE_REQUEST:
      return {
        ...state,
        itemsInfo: { ...state.itemsInfo, loading: true }
      };
    case actionType.ITEM_DETAILS_UPDATE_SUCCESS:
      return {
        ...state,
        itemsInfo: { ...state.itemsInfo, loading: false },
      };
    case actionType.ITEM_DETAILS_UPDATE_FAIL:
      return {
        ...state,
        itemsInfo: { ...state.itemsInfo, error: action.payload, loading: false },
      };

    case actionType.RESERVED_ITEMS_REQUEST:
      return {
        ...state,
        borrowInfo: { ...state.borrowInfo, borrowLoading: true }
      };
    case actionType.RESERVED_GET_ITEMS:
      return {
        ...state,
        borrowInfo: { ...state.borrowInfo, borrowItems: action.payload, borrowLoading: false }
      };
    case actionType.RESERVED_ITEMS_FAIL:
      return {
        ...state,
        borrowInfo: { ...state.borrowInfo, borrowError: action.payload, borrowLoading: false },
      };
      
    // case actionType.RESERVED_ADD_ITEM:
    //   borrowItems = state.borrowInfo.borrowItems.concat(action.payload);
    //   return {
    //     ...state,
    //     // borrowInfo: { ...state.borrowInfo, borrowItems: [...state.borrowItems, action.payload] }
    //     borrowInfo: { ...state.borrowInfo, borrowItems}
    //   };
    // case actionType.BORROW_ADD_ITEM:
    //   const borrowItem = action.payload;
    //   const item = state.borrowItems.find((x) => x._id === borrowItem._id);
    //   if (item) {
    //     borrowItems = state.borrowItems.map((x) =>
    //       x._id === item._id ? borrowItem : x
    //     );
    //     return { ...state, borrowItems };
    //   }
    //   borrowItems = [...state.borrowItems, borrowItem];
    //   return { ...state, borrowItems };
    case actionType.BORROW_REMOVE_ITEM:
      borrowItems = state.borrowInfo.borrowItems.filter((x) => x._id !== action.payload);
      return {
        ...state,
        borrowInfo: { ...state.borrowInfo, borrowItems }
      };

    default:
      return state;
  }
};

export { initialAppState, appReducer };
