import { useToDos } from '../contexts/ToDoContext';

function Footer() {
    const { items } = useToDos();

    const uncompletedItems = items.filter((item) => item.completed)

    return (
        <footer className="w-full font-light text-sm text-gray-300 border-t border-gray-200 py-2 px-4">
            <p>{uncompletedItems.length} {uncompletedItems.length === 1 ? 'item' : 'items'} left</p>
        </footer>
    );
}

export default Footer;
