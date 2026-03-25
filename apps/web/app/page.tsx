import {
  createTodo,
  createUser,
  deleteTodo,
  fetchUsers,
  toggleTodo,
} from "./actions";
import { WebSocketPanel } from "./websocket-panel";

export default async function Home() {
  const users = await fetchUsers();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1 style={{
        fontSize: "32px",
        marginBottom: "30px"
      }}>
        Users & Todos
      </h1>

      <form action={createUser} style={{ marginBottom: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input name="username" placeholder="Username" style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "white" }} />
        <input name="password" placeholder="Password" style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "white" }} />
        <button type="submit" style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}>
          Add User
        </button>
      </form>

      <div style={{
        display: "grid",
        gap: "20px"
      }}>
        {users.map((user) => (
          <div key={user.id} style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
          }}>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Password:</strong> {user.password}</p>

            <form action={createTodo} style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
              <input type="hidden" name="userId" value={user.id} />
              <input name="task" placeholder="Add todo" style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "white", flex: 1 }} />
              <button type="submit" style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: "#16a34a", color: "white", cursor: "pointer" }}>
                Add
              </button>
            </form>

            <div style={{ marginTop: "14px", display: "grid", gap: "8px" }}>
              {user.todos.length === 0 ? (
                <p style={{ opacity: 0.8 }}>No todos yet.</p>
              ) : (
                user.todos.map((todo) => (
                  <div key={todo.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", background: "#0f172a", padding: "8px", borderRadius: "6px" }}>
                    <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
                      {todo.task}
                    </span>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <form action={toggleTodo}>
                        <input type="hidden" name="id" value={todo.id} />
                        <input type="hidden" name="done" value={(!todo.done).toString()} />
                        <button type="submit" style={{ padding: "6px 10px", borderRadius: "6px", border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}>
                          {todo.done ? "Undo" : "Done"}
                        </button>
                      </form>

                      <form action={deleteTodo}>
                        <input type="hidden" name="id" value={todo.id} />
                        <button type="submit" style={{ padding: "6px 10px", borderRadius: "6px", border: "none", background: "#dc2626", color: "white", cursor: "pointer" }}>
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <WebSocketPanel />
    </div>
  );
}

// export const dynamic = "force-dynamic";
// or
// export const revalidate=0