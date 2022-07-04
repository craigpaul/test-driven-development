import { rest, server } from '../mocks/server'

function setSuccessfulToDoDeletion(toDo) {
  server.use(
    rest.delete(
      window.location.origin + '/api/to-dos/' + toDo.id,
      (_, res, ctx) => {
        return res(ctx.status(204))
      },
    ),
  );
}

export default setSuccessfulToDoDeletion
