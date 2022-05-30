import { createContext, useContext, useState } from 'react';

const ToDoContext = createContext({ items: [] });

function ToDoProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((previousState) => [...previousState, item]);
  };

  return (
    <ToDoContext.Provider value={{ addItem, items }}>{children}</ToDoContext.Provider>
  );
}

function useToDos() {
  return useContext(ToDoContext);
}

export { ToDoProvider, useToDos };
