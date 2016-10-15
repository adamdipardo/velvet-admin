# Try Velvet Admin

This is the admin interface for tryvelvet.com. It's built with React and Fluxxor. It interacts with the backend and expects it to be accessible via `/api`.

Install it with `npm install`.

## Developing

Run it with `gulp`, this will build the app and run a development server. The development server will expect the API to be running and accessible at `http://127.0.0.1:3001`.

Any changes made to the source code will trigger the app to be rebuilt. SASS changes are automatically recompiled and the browser will refresh the CSS without having to reload the page.

## Deploying

Run the command `gulp build-only --env=production` to create a production-ready build. The resulting files are added to the `build` directory. The resulting build expects to be run on `https://admin.tryvelvet.com/` so that socket works correctly.
