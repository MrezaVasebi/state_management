import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  onDeleteUser,
  onSaveUser,
  undoDeletedUser,
} from "../../st-management/redux-toolkit";
import { userType } from "../../types";

export const useReduxUserList = () => {
  const userDispatch = useDispatch<AppDispatch>();
  let { users } = useSelector((state: RootState) => state.userReducer);

  const initialState: {
    showModal: boolean;
    showUndoScreen: boolean;
    deletedIndex: number;
    deletedUser: userType;
  } = {
    showModal: false,
    showUndoScreen: false,
    deletedIndex: 0,
    deletedUser: {
      id: "",
      email: "",
      mobile: "",
      address: "",
      fullName: "",
    },
  };

  const set_show_modal = (value: boolean) => ({
    type: "SHOW_MODAL",
    payload: value,
  });

  const set_show_undo_screen = (value: boolean) => ({
    type: "SHOW_UNDO_SCREEN",
    payload: value,
  });

  const set_deleted_index = (value: number) => ({
    type: "DELETED_INDEX",
    payload: value,
  });

  const set_deleted_user = (value: userType) => ({
    type: "DELETED_USER",
    payload: value,
  });

  const reducer = (
    state = initialState,
    { type, payload }: { type: string; payload: any }
  ) => {
    switch (type) {
      case "DELETED_USER":
        return { ...state, deletedUser: payload as userType };
      case "DELETED_INDEX":
        return { ...state, deletedIndex: payload as number };
      case "SHOW_UNDO_SCREEN":
        return { ...state, showUndoScreen: payload as boolean };
      case "SHOW_MODAL":
        return { ...state, showModal: payload as boolean };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.showUndoScreen) {
      setTimeout(() => {
        dispatch(set_show_undo_screen(false));
      }, 2000);
    }
  }, [state.showUndoScreen]);

  const handleShowModal = (value: boolean): void => {
    dispatch(set_show_modal(value));
  };

  const handleSavingUser = (value: userType) => {
    userDispatch(onSaveUser({ value: value }));
  };

  const handleDeletingUser = (id: string) => {
    // deleted index
    dispatch(set_deleted_index(users.findIndex((el) => el.id === id)));

    // deleted user
    let deletedUser = users.find((el) => el.id === id);
    if (deletedUser !== undefined) dispatch(set_deleted_user(deletedUser));

    userDispatch(onDeleteUser({ id: id }));

    dispatch(set_show_undo_screen(true));
  };

  const handleUndoDeletingUser = () => {
    userDispatch(
      undoDeletedUser({ index: state.deletedIndex, value: state.deletedUser })
    );
    dispatch(set_show_undo_screen(false));
  };

  return {
    handleUndoDeletingUser,
    state,
    handleSavingUser,
    handleDeletingUser,
    handleShowModal,
  };
};
