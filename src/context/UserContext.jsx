
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({ user: null, setUser: () => {} });

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handle = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
