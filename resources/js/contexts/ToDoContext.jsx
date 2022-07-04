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

  const removeItem = (item) => {
    setItems((previousState) =>
      previousState.filter((previousItem) => item.id !== previousItem.id),
    );
  };

  const updateItem = (item) => {
    setItems((previousState) =>
      previousState.map((previousItem) => {
        if (item.id === previousItem.id) {
          return item
        }

        return previousItem
      })
    );
  };

  return (
    <ToDoContext.Provider value={{ addItem, items, removeItem, updateItem }}>{children}</ToDoContext.Provider>
  );
}

function useToDos() {
  return useContext(ToDoContext);
}

export { ToDoProvider, useToDos };
