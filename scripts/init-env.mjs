// `pnpm env:init`: creates .env from .env.example with a host port for the local
// database that nothing else is using, so this project's Postgres can run
// alongside other projects'. An existing .env is never touched. `pnpm db:up`
// runs it with --quiet first, so a fresh clone never starts on a taken port.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { connect, createServer } from "node:net";

const MIN_PORT = 5433;
const MAX_PORT = 5999;
const quiet = process.argv.includes("--quiet");

/**
 * Taken if something accepts connections on it, or it can't be bound. A bind
 * test alone isn't enough: on Windows, a port Docker publishes on 0.0.0.0 still
 * binds on 127.0.0.1.
 */
function isTaken(port) {
  return new Promise((resolve) => {
    const socket = connect({ port, host: "127.0.0.1" });
    socket.setTimeout(1000);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => {
      const server = createServer();
      server.once("error", () => resolve(true));
      server.listen(port, "127.0.0.1", () => server.close(() => resolve(false)));
    });
  });
}

if (existsSync(".env")) {
  if (!quiet) console.log(".env already exists; left as it is.");
  process.exit(0);
}

// A random port rather than the first free one, so a project whose database is
// stopped right now is unlikely to have its port handed out again.
let port;
for (let attempt = 0; attempt < 100 && port === undefined; attempt++) {
  const candidate = MIN_PORT + Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1));
  if (!(await isTaken(candidate))) port = candidate;
}
if (port === undefined) {
  console.error(
    `No free port between ${MIN_PORT} and ${MAX_PORT}: set POSTGRES_PORT in .env by hand.`
  );
  process.exit(1);
}

const env = readFileSync(".env.example", "utf8")
  .replace(/^POSTGRES_PORT=\d+/m, `POSTGRES_PORT=${port}`)
  .replace(/^(DATABASE_URL=postgres:\/\/\S+@localhost:)\d+/m, `$1${port}`);
if (!env.includes(`POSTGRES_PORT=${port}`) || !env.includes(`@localhost:${port}/`)) {
  console.error(
    "Couldn't find the POSTGRES_PORT and DATABASE_URL lines in .env.example: copy it to .env by hand."
  );
  process.exit(1);
}
writeFileSync(".env", env);
console.log(`Created .env: the local database will listen on 127.0.0.1:${port}.`);
if (!quiet) console.log("Next: pnpm db:up");
