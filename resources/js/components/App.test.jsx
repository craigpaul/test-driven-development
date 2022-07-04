import { faker } from '@faker-js/faker'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import setSuccessfulToDoCreation from '../__helpers__/setSuccessfulToDoCreation';
import setSuccessfulToDoFetch from '../__helpers__/setSuccessfulToDoFetch';
import setSuccessfulToDoUpdate from '../__helpers__/setSuccessfulToDoUpdate';
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
  const [toDo] = setSuccessfulToDoFetch({ completed: false, count: 1 });

  setSuccessfulToDoUpdate({ ...toDo, completed: true });

  render(
    <ToDoProvider>
      <App />
    </ToDoProvider>
  );

  const list = await screen.findByRole('list');
  const listItem = within(list).getByRole('listitem', { name: new RegExp(toDo.title, 'i') });

  expect(list).toBeInTheDocument();
  expect(listItem).toBeInTheDocument();

  const checkbox = within(listItem).getByRole('checkbox');

  // Using the suggested approach of clicking the checkbox with userEvent is bugged
  // with the currently installed versions of our testing dependencies. Using the
  // more low-level implementation of fireEvent prevents this incorrect warning
  // and produces a successful result.
  //
  // https://github.com/testing-library/react-testing-library/issues/1051
  // userEvent.click(checkbox);

  fireEvent.click(checkbox);

  const completed = await within(listItem).findByTitle(/Completed/i);

  expect(checkbox.nextSibling).toContainElement(completed);
});

it('can change the title of an existing to do', async () => {
  const [toDo] = setSuccessfulToDoFetch({ count: 1 });
  const title = faker.random.words();

  setSuccessfulToDoUpdate({ ...toDo, title });

  render(
    <ToDoProvider>
      <App />
    </ToDoProvider>
  );

  const list = await screen.findByRole('list');
  const listItem = within(list).getByRole('listitem', { name: new RegExp(toDo.title, 'i') });

  expect(list).toBeInTheDocument();
  expect(listItem).toBeInTheDocument();

  const input = within(listItem).getByRole('textbox');

  userEvent.type(input, title);
  userEvent.tab();
});

it('can delete an existing to do', async () => {
  // Arrange

  // Act

  // Assert
});
