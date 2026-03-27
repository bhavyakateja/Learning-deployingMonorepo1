import { prismaClient } from "db/client";

const server = Bun.serve({
  port: 3002,

  fetch(req, server) {
    // Upgrade HTTP → WebSocket
    if (server.upgrade(req)) return;

    return new Response("WS running");
  },

  websocket: {
    async message(ws, message) {
      try {
        // Optional: check message type
        if (message.toString() !== "create-user") {
          ws.send(JSON.stringify({ error: "Invalid message type" }));
          return;
        }

        // Create random user
        const user = await prismaClient.user.create({
          data: {
            username: Math.random().toString(),
            password: Math.random().toString(),
          },
        });

        const safeUser = {
          ...user,
          id: user.id.toString(),
        };

        // Send response
        ws.send(JSON.stringify(safeUser));

      } catch (err: any) {
        ws.send(
          JSON.stringify({
            error: err?.message || "Something went wrong",
          })
        );
      }
    },

    open(ws) {
      console.log("Client connected");
    },

    close(ws) {
      console.log("Client disconnected");
    },
  },
});

console.log(`WS running on ws://localhost:${server.port}`);