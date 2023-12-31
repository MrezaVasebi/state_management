import { useEffect, useReducer } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import {
  loadingState,
  onFetchUsersList,
  userFilterState,
  usersListState,
  usersState,
} from "../../st-management/recoil";
import { userType } from "../../types";
import { IInit } from "./useCtxUserList";

export const useRecoilUserList = () => {
  const [users, setUsers] = useRecoilState(usersState); // local
  const [filteredUser, setFilteredUser] = useRecoilState(userFilterState);

  const [loading, setLoading] = useRecoilState(loadingState); // api
  const [usersList, setUserList] = useRecoilState(usersListState); // api

  const initialState: IInit = {
    deletedIndex: 0,
    showModal: false,
    showUndoScreen: false,
    showFilterModal: false,
    deletedUser: {
      id: "",
      email: "",
      mobile: "",
      gender: "",
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

  const set_show_filter_modal = (value: boolean) => ({
    type: "SHOW_FILTER_MODAL",
    payload: value,
  });

  const reducer = (
    state = initialState,
    { type, payload }: { type: string; payload: any }
  ) => {
    switch (type) {
      case "SHOW_FILTER_MODAL":
        return { ...state, showFilterModal: payload as boolean };
      case "SHOW_MODAL":
        return { ...state, showModal: payload as boolean };
      case "DELETED_USER":
        return { ...state, deletedUser: payload as userType };
      case "DELETED_INDEX":
        return { ...state, deletedIndex: payload as number };
      case "SHOW_UNDO_SCREEN":
        return { ...state, showUndoScreen: payload as boolean };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // fetching users list
    fetchDataCallback();
  }, []);

  useEffect(() => {
    if (state.showUndoScreen) {
      setTimeout(() => {
        dispatch(set_show_undo_screen(false));
        onClearDeletedUser();
      }, 2000);
    }
  }, [state.showUndoScreen]);

  const fetchDataCallback = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        try {
          setLoading(true);

          const response = await snapshot.getPromise(onFetchUsersList);
          setUserList(response);

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }
  );

  const onClearDeletedUser = () => {
    // clear info
    dispatch(
      set_deleted_user({
        id: "",
        email: "",
        mobile: "",
        gender: "",
        address: "",
        fullName: "",
      })
    );
  };

  const handleShowModal = (value: boolean) => {
    dispatch(set_show_modal(value));
    onClearDeletedUser();
  };

  const handleSavingUser = (value: userType) => {
    if (users.length === 0) {
      let allUsers = [...users, value];
      setUsers(allUsers);
    } else {
      let existed = users.find((el) => el.id === value.id);

      // user not existed, so add it
      if (existed === undefined) {
        let allUsers = [...users, value];
        setUsers(allUsers);
      } else {
        // user existed
        // 1. delete it from list by index
        // 2. add new one to users list
        let newOne = [...users];
        let index = newOne.findIndex((el) => el.id === value.id);
        newOne.splice(index, 1);

        newOne = [...newOne, value];
        setUsers(newOne);

        onClearDeletedUser();
      }
    }
  };

  // deleting user
  const handleDeletingUser = (id: string) => {
    // deleted index
    dispatch(set_deleted_index(users.findIndex((el) => el.id === id)));

    // deleted user
    let deletedUser = users.find((el) => el.id === id);
    if (deletedUser !== undefined) dispatch(set_deleted_user(deletedUser));

    setUsers(users.filter((el) => el.id !== id));

    dispatch(set_show_undo_screen(true));
  };

  // undo deleting user
  const handleUndoDeletingUser = () => {
    let existedUsers = [...users];
    existedUsers.splice(state.deletedIndex, 0, state.deletedUser);
    setUsers(existedUsers);

    dispatch(set_show_undo_screen(false));
  };

  // editing user info
  const handleEditItem = (value: userType) => {
    dispatch(set_show_modal(true));
    dispatch(set_deleted_user(value));
  };

  // show, hide modal
  const handleFilterModal = (value: boolean) => {
    dispatch(set_show_filter_modal(value));
  };

  // show, hide modal
  const handleApplyFilter = (value: string) => {
    setFilteredUser(value);
  };

  return {
    loading,
    usersList,
    handleFilterModal,
    handleApplyFilter,
    handleEditItem,
    handleUndoDeletingUser,
    handleDeletingUser,
    handleSavingUser,
    handleShowModal,
    state,
  };
};
