import { type_user } from "./api";

export type userType = {
  id: string;
  email: string;
  mobile: string;
  gender: string;
  address: string;
  fullName: string;
};

// this section in used in context-api
export type UserContextType = {
  users: userType[]; // local
  copiedUsers: userType[];

  usersList: type_user[]; // api

  loading: boolean;

  onFetchUsersList: () => void;
  onDeleteUser: (id: string) => void;
  onSaveUser: (user: userType) => void;
  onEditUser: (user: userType) => void;
  onFilterByGender: (type: string) => void;
  undoDeletedUser: (index: number, user: userType) => void;
};
