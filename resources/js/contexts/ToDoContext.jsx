import { createContext, useContext, useState } from 'react';

const ToDoContext = createContext({ items: [] });

function ToDoProvider({ children }) {
  const [items] = useState([
    { id: 1, title: 'Go to the Gym', completed: false },
    { id: 2, title: 'Go to the Store', completed: true },
  ]);

  return (
    <ToDoContext.Provider value={{ items }}>{children}</ToDoContext.Provider>
  );
}

function useToDos() {
  return useContext(ToDoContext);
}

export { ToDoProvider, useToDos };
