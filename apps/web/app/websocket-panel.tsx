"use client";

import { useEffect, useRef, useState } from "react";

type WsUserMessage = {
    id: string;
    username: string;
    password: string;
};

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3002";

export function WebSocketPanel() {
    const socketRef = useRef<WebSocket | null>(null);
    const [connectionState, setConnectionState] = useState<"connecting" | "open" | "closed" | "error">("connecting");
    const [messages, setMessages] = useState<WsUserMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const socket = new WebSocket(WS_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            setConnectionState("open");
            setError(null);
        };

        socket.onclose = () => {
            setConnectionState("closed");
        };

        socket.onerror = () => {
            setConnectionState("error");
            setError("WebSocket error");
        };

        socket.onmessage = async (event) => {
            try {
                let text: string;

                if (typeof event.data === "string") {
                    text = event.data;
                } else if (event.data instanceof Blob) {
                    text = await event.data.text();
                } else if (event.data instanceof ArrayBuffer) {
                    text = new TextDecoder().decode(event.data);
                } else {
                    throw new Error("Unsupported message type");
                }

                const data = JSON.parse(text) as WsUserMessage | { error: string };

                if ("error" in data) {
                    setError(data.error);
                    return;
                }

                setMessages((prev) => [data, ...prev].slice(0, 8));

            } catch (err) {
                console.error("WS ERROR:", err);
                setError("Invalid message from websocket server");
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const createRandomUserViaWs = () => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            setError("WebSocket is not connected");
            return;
        }

        socketRef.current.send("create-user");
    };

    return (
        <div style={{ marginTop: "24px", padding: "20px", borderRadius: "10px", background: "#1e293b" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>WebSocket (apps/ws)</h2>
            <p>
                <strong>Status:</strong> {connectionState}
            </p>
            <p>
                <strong>URL:</strong> {WS_URL}
            </p>

            <button
                type="button"
                onClick={createRandomUserViaWs}
                style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#7c3aed",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Create Random User via WS
            </button>

            {error ? <p style={{ color: "#fca5a5", marginTop: "10px" }}>{error}</p> : null}

            <div style={{ marginTop: "14px", display: "grid", gap: "8px" }}>
                {messages.length === 0 ? (
                    <p style={{ opacity: 0.8 }}>No websocket messages yet.</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={String(message.id)}
                            style={{
                                background: "#0f172a",
                                borderRadius: "6px",
                                padding: "8px",
                            }}
                        >
                            <p>
                                <strong>User ID:</strong> {message.id}
                            </p>
                            <p>
                                <strong>Username:</strong> {message.username}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
