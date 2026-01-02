import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role");
    return role ? { role } : null;
  });

  const login = (authResponse) => {
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("role", authResponse.role);

    setToken(authResponse.token);
    setUser({
      name: authResponse.name,
      role: authResponse.role,
    });
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
