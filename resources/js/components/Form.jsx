import { useToDos } from '../contexts/ToDoContext';

function Form() {
  const { items } = useToDos();

  return (
    <header className="relative h-16 w-full py-2 pl-14 pr-4">
      {items.length > 0 ? (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-300">
          <svg
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      ) : null}
      <input
        className="h-full w-full appearance-none font-light text-gray-400 placeholder:text-gray-200 focus:outline-none"
        placeholder="What needs to be done?"
        type="text"
      />
    </header>
  );
}

export default Form;
