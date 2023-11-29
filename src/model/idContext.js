import React, { createContext, useContext, useState } from 'react';

const IdContext = createContext();

export function IdProvider({ children }) {
  const [id, setId] = useState('');

  return (
    <IdContext.Provider value={{ id, setId }}>
      {children}
    </IdContext.Provider>
  );
}

export function useId() {
  return useContext(IdContext);
}