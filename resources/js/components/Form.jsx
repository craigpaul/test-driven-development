import { useToDos } from '../contexts/ToDoContext';

function Form() {
    const { items } = useToDos();

    return (
        <header className="w-full h-16 py-2 pl-14 pr-4 relative">
            {items.length > 0 ? (
                <div className="text-gray-300 absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            ) : null}
            <input
                className="appearance-none focus:outline-none placeholder:text-gray-200 font-light text-gray-400 w-full h-full"
                placeholder="What needs to be done?"
                type="text"
            />
        </header>
    );
}

export default Form;
