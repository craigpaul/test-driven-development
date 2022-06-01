import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import setSuccessfulToDoCreation from '../__helpers__/setSuccessfulToDoCreation';
import setSuccessfulToDoFetch from '../__helpers__/setSuccessfulToDoFetch';
import { ToDoProvider } from '../contexts/ToDoContext';
import App from './App';

it('can create a new to do', async () => {
  setSuccessfulToDoFetch();

  const toDo = setSuccessfulToDoCreation();

  render(
    <ToDoProvider>
      <App />
    </ToDoProvider>
  );

  const input = screen.getByRole('textbox');

  expect(input).toBeInTheDocument();

  userEvent.type(input, toDo.title);

  await waitFor(() => expect(input).toHaveValue(toDo.title));

  userEvent.type(input, '{Enter}');

  const list = await screen.findByRole('list');
  const listItem = within(list).getByRole('listitem', { name: new RegExp(toDo.title, 'i') });

  expect(list).toBeInTheDocument();
  expect(listItem).toBeInTheDocument();

  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
});

it('can display existing to dos', async () => {
  const toDos = setSuccessfulToDoFetch({ count: 2 });

  render(
    <ToDoProvider>
      <App />
    </ToDoProvider>
  );

  const list = await screen.findByRole('list');
  const listItems = within(list).getAllByRole('listitem');

  expect(list).toBeInTheDocument();
  expect(listItems).toHaveLength(toDos.length);

  toDos.forEach((toDo) => {
    const listItem = within(list).getByRole('listitem', { name: new RegExp(toDo.title, 'i') })

    expect(listItem).toBeInTheDocument();
  });
});

it('can mark a to do as completed', async () => {
  // Arrange

  // Act

  // Assert
});

it('can delete an existing to do', async () => {
  // Arrange

  // Act

  // Assert
});
