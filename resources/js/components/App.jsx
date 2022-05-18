import { useState } from 'react';

function App() {
    const [items] = useState([{ id: 1, title: 'Go to the Gym' }, { id: 2, title: 'Go to the Store' }]);

    return (
        <div className="flex justify-center pt-40">
            <div className="w-3/4 max-w-lg bg-white shadow-md">
                <header className="w-full h-16 py-2 pl-14 pr-4">
                    <input
                        className="appearance-none focus:outline-none placeholder:text-gray-200 font-light text-gray-400 w-full h-full"
                        placeholder="What needs to be done?"
                        type="text"
                    />
                </header>
                {items.length > 0 ? (
                    <>
                        <section className="w-full">
                            <ul className="font-light text-gray-400">
                                {items.map((item) => (
                                    <div className="py-4 border-t border-gray-200 flex items-center justify-between group" key={item.id}>
                                        <div className="flex items-center">
                                            <div className="mx-4">
                                                <input className="sr-only peer" id={`todo-${item.id}`} type="checkbox" />
                                                <label className="flex cursor-pointer h-6 w-6 border border-gray-200 rounded-full peer-checked:border-lime-400 peer-checked:bg-lime-400" htmlFor={`todo-${item.id}`} />
                                            </div>
                                            <div>{item.title}</div>
                                        </div>
                                        <div className="flex mr-4">
                                            <button className="focus:outline-none focus:opacity-100 group-hover:opacity-100 opacity-0 text-gray-300" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </section>
                        <footer className="w-full font-light text-sm text-gray-300 border-t border-gray-200 py-2 px-4">
                            <p>{items.length} {items.length === 1 ? 'item' : 'items'} left</p>
                        </footer>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default App;
