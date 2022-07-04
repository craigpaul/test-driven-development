import { rest, server } from '../mocks/server'

function setSuccessfulToDoUpdate(toDo) {
  server.use(
    rest.put(
      window.location.origin + '/api/to-dos/' + toDo.id,
      (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(toDo))
      },
    ),
  );
}

export default setSuccessfulToDoUpdate
