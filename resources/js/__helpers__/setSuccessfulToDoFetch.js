import { faker } from '@faker-js/faker'
import { rest, server } from '../mocks/server'

function setSuccessfulToDoFetch({ completed = null, count } = { completed: null, count: 0 }) {
  const toDos = [];

  for (let i = 0; i < count; i++) {
    toDos.push({
      id: faker.datatype.number(),
      title: faker.random.words(),
      completed: completed === null ? faker.datatype.boolean() : completed,
    });
  }

  server.use(
    rest.get(
      window.location.origin + '/api/to-dos',
      (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(toDos))
      },
    ),
  );

  return toDos;
}

export default setSuccessfulToDoFetch
