import { faker } from '@faker-js/faker'
import { rest, server } from '../mocks/server'

function setSuccessfulToDoCreation() {
  const toDo = {
    id: faker.datatype.number(),
    title: faker.random.words(),
    completed: false,
  };

  server.use(
    rest.post(
      window.location.origin + '/api/to-dos',
      (_, res, ctx) => {
        return res(ctx.status(201), ctx.json(toDo))
      },
    ),
  );

  return toDo;
}

export default setSuccessfulToDoCreation
