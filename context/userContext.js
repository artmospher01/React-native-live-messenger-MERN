import react, { createContext, useState } from "react";

const UserType = createContext();

const UserProvider = ({ children }) => {
  const [userId, setuserId] = useState("");
  return (
    <UserType.Provider value={{ userId, setuserId }}>
      {children}
    </UserType.Provider>
  );
};

export { UserType, UserProvider };
