import { createRoot } from 'react-dom/client';
import App from './components/App';
import { ToDoProvider } from './contexts/ToDoContext';

const root = createRoot(document.getElementById('root'));

root.render(
    <ToDoProvider>
        <App />
    </ToDoProvider>
);
