import { useToDos } from '../contexts/ToDoContext';

function Footer() {
  const { items } = useToDos();

  const uncompletedItems = items.filter((item) => item.completed);
  const length = uncompletedItems.length;
  const message = `${length} ${length === 1 ? 'item' : 'items'} left`;

  return (
    <footer className="w-full border-t border-gray-200 py-2 px-4 text-sm font-light text-gray-300">
      <p>{message}</p>
    </footer>
  );
}

export default Footer;
