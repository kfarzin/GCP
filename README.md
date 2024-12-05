## Descriptions

This is a very simple implementation of the provided requirements and in fact in real production env the implementation and design will be completely different. This project is powered by nx, so both backend and front are handled by nx. The backend is written using nodejs as was instructed by the requirement (otherwise another framework e.g. `nestjs` could be used) and the frontend is written using angular as according to the requirement it could be any framework/library.

### Backend

The backend project uses fastify webserver and has a simple architecture that uses controller, service and repositories. An in-memory singleton implementation for a database with a very simple structure is used which is reset after each restart.

For the authentication JWT token strategy is used and implemented.

The backend has 4 endpoints:

- GET => api/v1/resources/protected `requires token`
- GET => api/v1/resources/unprotected `requires no token`
- POST => api/v1/auth/register `body needs to have email and password`
- POST => api/v1/auth/login `body needs to have email and password`

Comments are in code to clarify the code snippets.

### Frontend

this is a angular `v18` project.

a very simple app, that use `ngrx/signalstore`, `interceptors`, `tailwind`, ...

interceptor is used to include the `token` in every request (if it exists).

when we sign in, the token is stored in `localstorage`.

users can login or register. on the home page they can click on 2 buttons, which will in turn display the result of the request.

_note that an artificial 1 second delay is added to all requests. which can be removed by removing the interceptor from `app.config:L13:41`_

## How to run the project

Nodejs (npx) must be available on the test machine.

1. Dependencies
   npm i
2. projects can be run all together (recommended) using the following command:

- npx nx run-many -t serve -p frontend backend

3. or separately using following commands:

- npx nx serve backend
- npx nx serve frontend

in both case the backend runs on port 3000 and frontend runs on port 4200.

4. Some end to end tests (no unit test) are provided for the backend which can be run using the following command:

- npx nx test backend

_Please be aware that when user is not logged out and the application (backend) is restarted, although the token does not exist on the server, but since it still exists on the frontend, it works. This wont be the case in production environment, and only here exists for this test project_
