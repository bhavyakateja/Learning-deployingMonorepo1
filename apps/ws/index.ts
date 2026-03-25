import { prismaClient } from "db/client";

const server = Bun.serve({
  port: 3002,

  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("WS running");
  },

  websocket: {
    async message(ws) {
      try {
        // create random user
        const user = await prismaClient.user.create({
          data: {
            username: Math.random().toString(),
            password: Math.random().toString(),
          },
        });

        // send created user back
        ws.send(JSON.stringify(user));

      } catch (err: any) {
        ws.send(JSON.stringify({ error: err.message }));
      }
    },
  },
});

console.log(`WS running on ws://localhost:${server.port}`);