import { useToDos } from '../contexts/ToDoContext';
import Item from './Item';

function List() {
    const { items } = useToDos();

    return (
        <section className="w-full">
            <ul className="font-light text-gray-400">
                {items.map((item) => <Item item={item} />)}
            </ul>
        </section>
    );
}

export default List;
