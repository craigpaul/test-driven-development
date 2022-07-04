import clsx from 'clsx';
import { useToDos } from '../contexts/ToDoContext';

function Item({ item }) {
  const { updateItem } = useToDos();

  const inputId = `item-${item.id}`;
  const labelId = `${inputId}-label`;

  const handleBlur = (event) => {
    fetch('/api/to-dos/' + item.id, {
      body: JSON.stringify({ title: event.currentTarget.value }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).then((response) => {
      return response.json();
    }).then((item) => {
      updateItem(item);
    });
  }

  const handleChange = (event) => {
    fetch('/api/to-dos/' + item.id, {
      body: JSON.stringify({ completed: event.currentTarget.checked }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).then((response) => {
      return response.json();
    }).then((item) => {
      updateItem(item);
    });
  };

  return (
    <li
      aria-labelledby={labelId}
      className="group flex items-center justify-between border-t border-gray-200 py-4"
    >
      <div className="flex items-center w-full">
        <div className="mx-4">
          <input
            className="sr-only"
            defaultChecked={item.completed}
            id={inputId}
            onChange={handleChange}
            type="checkbox"
          />
          <label
            aria-hidden="true"
            className={clsx(
              'flex h-6 w-6 cursor-pointer rounded-full border border-gray-200 text-lime-500',
              item.completed ? 'border-lime-500' : null,
            )}
            htmlFor={inputId}
          >
            {item.completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="-1 -2 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <title>Completed</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : null}
          </label>
        </div>
        <div
          className={clsx('w-full', item.completed ? 'text-gray-300 line-through' : null)}
          id={labelId}
        >
          <input className="outline-none w-full truncate" defaultValue={item.title} onBlur={handleBlur} />
        </div>
      </div>
      <div className="mr-4 flex">
        <button
          aria-label="Delete"
          className="text-gray-300 opacity-0 focus:opacity-100 focus:outline-none group-hover:opacity-100"
          type="button"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default Item;
