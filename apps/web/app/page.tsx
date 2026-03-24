import { prismaClient } from "db/client";

export default async function Home() {
  const users = await prismaClient.user.findMany();

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
        Users
      </h1>

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
          </div>
        ))}
      </div>
    </div>
  );
}