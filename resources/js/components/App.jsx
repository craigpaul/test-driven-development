import { useToDos } from '../contexts/ToDoContext';
import Footer from './Footer';
import Form from './Form';
import List from './List';

function App() {
    const { items } = useToDos()

    return (
        <div className="flex justify-center pt-40">
            <div className="w-3/4 max-w-lg bg-white shadow-md">
                <Form />
                {items.length > 0 ? (
                    <>
                        <List />
                        <Footer />
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default App;
