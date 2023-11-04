export type userType = {
  id: string;
  email: string;
  mobile: string;
  address: string;
  fullName: string;
};

export type UserContextType = {
  users: userType[];
  onDeleteUser: (id: string) => void;
  onSaveUser: (user: userType) => void;
  undoDeletedUser: (index: number, user: userType) => void;
};