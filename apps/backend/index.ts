import dotenv from "dotenv";
dotenv.config()
import express from "express";
import { prismaClient } from "db/client";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      include: {
        todos: true,
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.post("/user", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Both username and password are required",
    });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        username: username.trim(),
        password: password.trim(),
      },
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.post("/todo", async (req, res) => {
  const { task, userId } = req.body;

  if (!task || !userId) {
    return res.status(400).json({
      success: false,
      message: "task and userId are required",
    });
  }

  try {
    const todo = await prismaClient.todo.create({
      data: {
        task,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      todo,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const todos = await prismaClient.todo.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  try {
    const updatedTodo = await prismaClient.todo.update({
      where: { id },
      data: { done },
    });

    res.status(200).json({
      success: true,
      todo: updatedTodo,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prismaClient.todo.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Todo deleted",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(3001, () => {
  console.log(`Server up at http://localhost:3005`);
});
// console.log("DB URL:", process.env.DATABASE_URL);
// console.log("TEST:", process.env);