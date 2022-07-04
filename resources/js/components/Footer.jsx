import { useToDos } from '../contexts/ToDoContext';

function Footer() {
  const { items } = useToDos();
  const length = items.filter((item) => item.completed === false).length;

  return (
    <footer className="w-full border-t border-gray-200 py-2 px-4 text-sm font-light text-gray-300">
      <div role="alert">{length === 1 ? '1 item left' : `${length} items left`}</div>
    </footer>
  );
}

export default Footer;
