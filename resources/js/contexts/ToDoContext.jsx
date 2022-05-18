import { createContext, useContext, useState } from 'react';

const ToDoContext = createContext({ items: [] });

function ToDoProvider({ children }) {
  const [items] = useState([]);

  return (
    <ToDoContext.Provider value={{ items }}>{children}</ToDoContext.Provider>
  );
}

function useToDos() {
  return useContext(ToDoContext);
}

export { ToDoProvider, useToDos };
