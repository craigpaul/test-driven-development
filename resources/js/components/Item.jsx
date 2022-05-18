function Item({ item }) {
    return (
        <li aria-labelledby={`todo-${item.id}-label`} className="py-4 border-t border-gray-200 flex items-center justify-between group" key={item.id}>
            <div className="flex items-center">
                <div className="mx-4">
                    <input className="sr-only peer" defaultChecked={item.completed} id={`todo-${item.id}`} type="checkbox" />
                    <label className="flex cursor-pointer h-6 w-6 border border-gray-200 rounded-full peer-checked:border-lime-400 text-lime-500" htmlFor={`todo-${item.id}`}>
                        {item.completed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="-1 -2 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : null}
                    </label>
                </div>
                <div className={item.completed ? 'line-through text-gray-300' : null} id={`todo-${item.id}-label`}>{item.title}</div>
            </div>
            <div className="flex mr-4">
                <button className="focus:outline-none focus:opacity-100 group-hover:opacity-100 opacity-0 text-gray-300" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </li>
    );
}

export default Item;
