"use server";

import { revalidatePath } from "next/cache";

export type Todo = {
    id: string;
    task: string;
    done: boolean;
    userId: string;
};

export type User = {
    id: string;
    username: string;
    password: string;
    todos: Todo[];
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function fetchUsers() {
    const response = await fetch(`${BACKEND_URL}/users`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch users. Status: ${response.status}`);
    }

    const data = (await response.json()) as {
        success: boolean;
        users?: User[];
        error?: string;
    };

    if (!data.success) {
        throw new Error(data.error ?? "Failed to fetch users");
    }

    return data.users ?? [];
}

export async function createUser(formData: FormData) {
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!username || !password) {
        return;
    }

    const response = await fetch(`${BACKEND_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create user. Status: ${response.status}`);
    }

    revalidatePath("/");
}

export async function createTodo(formData: FormData) {
    const task = formData.get("task")?.toString().trim();
    const userId = formData.get("userId")?.toString().trim();

    if (!task || !userId) {
        return;
    }

    const response = await fetch(`${BACKEND_URL}/todo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, userId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create todo. Status: ${response.status}`);
    }

    revalidatePath("/");
}

export async function toggleTodo(formData: FormData) {
    const id = formData.get("id")?.toString().trim();
    const doneValue = formData.get("done")?.toString();

    if (!id || typeof doneValue === "undefined") {
        return;
    }

    const response = await fetch(`${BACKEND_URL}/todo/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: doneValue === "true" }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update todo. Status: ${response.status}`);
    }

    revalidatePath("/");
}

export async function deleteTodo(formData: FormData) {
    const id = formData.get("id")?.toString().trim();

    if (!id) {
        return;
    }

    const response = await fetch(`${BACKEND_URL}/todo/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete todo. Status: ${response.status}`);
    }

    revalidatePath("/");
}
