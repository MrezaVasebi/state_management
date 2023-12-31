import React, { createContext, useReducer } from "react";
import { invokeApi } from "../../hooks";
import { type_user } from "../../types/api";
import { UserContextType, userType } from "../../types/user_type";

export const UserContext = createContext<UserContextType | null>(null);

interface IUserProvider {
  children: React.ReactNode;
}

export const UserProvider = (props: IUserProvider) => {
  const initialState = {
    users: [] as userType[],
    copiedUsers: [] as userType[],

    usersList: [] as type_user[],

    loading: false as boolean,
  };

  const set_users = (value: userType[]) => ({ type: "USERS", payload: value });

  const set_loading = (value: boolean) => ({ type: "LOADING", payload: value });

  const set_users_list = (value: type_user[]) => ({
    type: "USERS_LIST",
    payload: value,
  });

  const set_copied_users = (value: userType[]) => ({
    type: "COPIED_USERS",
    payload: value,
  });

  const reducer = (
    state = initialState,
    { type, payload }: { type: string; payload: any }
  ) => {
    switch (type) {
      case "LOADING":
        return { ...state, loading: payload as boolean };
      case "COPIED_USERS":
        return { ...state, copiedUsers: payload as userType[] };
      case "USERS_LIST":
        return { ...state, usersList: payload as type_user[] };
      case "USERS":
        return { ...state, users: payload as userType[] };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // save user
  const onSaveUser = (value: userType) => {
    let newData: userType[] = [...state.copiedUsers];
    newData.push(value);

    dispatch(set_users(newData));
    dispatch(set_copied_users(newData));
  };

  // delete user
  const onDeleteUser = (id: string) => {
    let newData = state.copiedUsers.filter((el: userType) => el.id !== id);

    dispatch(set_users(newData));
    dispatch(set_copied_users(newData));
  };

  // undo delete user
  const undoDeletedUser = (index: number, user: userType) => {
    let newData = [...state.copiedUsers];
    newData.splice(index, 0, user); // adding item to specific index in array

    dispatch(set_users(newData));
    dispatch(set_copied_users(newData));
  };

  // filter user by gender
  const onFilterByGender = (type: string) => {
    if (type === "all") dispatch(set_copied_users(state.users));
    else if (type === "male" || type === "female") {
      let res = state.users.filter((el) => el.gender === type);
      dispatch(set_copied_users(res.length === 0 ? state.users : res));
    }
  };

  // edit user
  const onEditUser = (value: userType) => {
    // deleting existed user
    let newOne = [...state.copiedUsers];
    let index = newOne.findIndex((el) => el.id === value.id);
    newOne.splice(index, 1);

    newOne.push(value);
    dispatch(set_users(newOne));
    dispatch(set_copied_users(newOne));
  };

  // fetch and save users list
  const onFetchUsersList = async () => {
    dispatch(set_loading(true));
    let response = await invokeApi<type_user[]>("users");

    if (response === undefined || typeof response === "string") {
      // console.log(response); // error

      dispatch(set_loading(false));
      dispatch(set_users_list([] as type_user[]));
    } else if (typeof response === "object") {
      // correct data
      dispatch(set_loading(false));
      dispatch(set_users_list(response));
    }
  };

  return (
    <UserContext.Provider
      value={{
        usersList: state.usersList, // api

        users: state.users, // local
        copiedUsers: state.copiedUsers, // local

        loading: state.loading,

        onSaveUser: onSaveUser,
        onEditUser: onEditUser,
        onDeleteUser: onDeleteUser,
        undoDeletedUser: undoDeletedUser,
        onFilterByGender: onFilterByGender,
        onFetchUsersList: onFetchUsersList,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
