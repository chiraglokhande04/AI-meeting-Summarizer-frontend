import { createContext, useCallback, useState, useEffect } from "react";
import { getProfile } from "../api/auth";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetchUser = useCallback(async () => {
    try {
      const res = await getProfile();
      if (res.success) {
        setUser(res.data);
      }
    } catch (error) {
      setUser(null);
      console.error("Failed to refresh profile", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const initAuth = async () => {
      await refetchUser();
      setLoading(false);
    };
    initAuth();
  }, [refetchUser]);
  return (
    <AuthContext.Provider value={{ loading, user, setUser, refetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
