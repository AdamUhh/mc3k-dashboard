
# Headless Dashboard

A highly customizable dashboard for your needs.

## Development Setup

### Setup Docker

Start the Docker containers:

```sh
docker-compose up
```

> **Note:** If you are using Linux, you may need to start Docker manually:
>
> ```sh
> sudo systemctl start docker
> sudo docker compose up
> ```

### Initialize Database Tables

Synchronize your database schema with the application:

```sh
yarn dbpush
```

### Run Locally

Start the development server:

```sh
yarn dev
```

## Understanding the Code Structure

### Why Are There Multiple Functions for Querying and Mutating Data?

The codebase is structured into distinct function categories to improve organization, reusability, and maintainability:

#### Actions
- Handle authentication and input validation.
- Ensure that only authorized users perform specific actions.
- **TL;DR:** Used for authentication and data validation.

#### Use-Cases
- Manage multiple data-access calls.
- Implement business logic and coordinate workflows.
- **TL;DR:** Used for multiple database operation calls.

#### Data-Access
- Directly interact with the database (CRUD operations).
- Keep database logic separate from other parts of the app.
- **TL;DR:** Used for direct database interactions.

## Miscellaneous

### TypeScript Signature Truncation Issue

If TypeScript truncates type signatures, follow these steps:

#### Recommended Fix (Linux):

```sh
yarn patchts
chmod +x ./patch-ts.sh # run this if permission is denied
yarn
```
- Then fully restart your development environment.
- Verify that truncation is resolved in type hints.

#### Manual Fix:

1. Open `node_modules/typescript/lib/typescript.js` (or `node_modules/typescript/lib/tsserver.js`).
2. Locate this line:
   ```js
   var defaultMaximumTruncationLength = 160
   ```
3. Change it to a higher value (e.g., `1000`, `1e6`, etc.).
4. Save the file.
5. Fully restart your development environment.
6. Verify that truncation is resolved in type hints.


