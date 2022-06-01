import { createContext, useContext, useEffect, useState } from 'react';

const ToDoContext = createContext({ items: [] });

function ToDoProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/to-dos', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then((response) => {
      return response.json();
    }).then((items) => {
      setItems(items);
    });
  }, []);

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
