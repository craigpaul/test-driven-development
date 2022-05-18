import { useToDos } from '../contexts/ToDoContext';

function Footer() {
  const { items } = useToDos();

  console.log(`We currently have ${items.length} total item(s), but how many are still left to complete? Let's show that in a message within the UI!`);

  return (
    <footer className="w-full border-t border-gray-200 py-2 px-4 text-sm font-light text-gray-300" />
  );
}

export default Footer;
