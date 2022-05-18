import { useToDos } from '../contexts/ToDoContext';

function List() {
  const { items } = useToDos();

  console.log(`We currently have ${items.length} total item(s), but none of them are showing on the screen? How can we display these items within the UI?`);

  return (
    <section className="w-full">
      <ul className="font-light text-gray-400" />
    </section>
  );
}

export default List;
