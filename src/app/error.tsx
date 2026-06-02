"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const msg = error?.message ?? "Unknown error";
  const looksLikeDbAuth =
    msg.includes("Authentication failed against database server") ||
    msg.includes("PrismaClientInitializationError");

  return (
    <html>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Something went wrong</h2>

        {looksLikeDbAuth ? (
          <>
            <p>
              It looks like the app can’t connect to your Postgres database.
              Prisma reports an authentication failure for the configured{" "}
              <code>DATABASE_URL</code>.
            </p>
            <ul>
              <li>
                Verify <code>DATABASE_URL</code> and <code>DIRECT_URL</code> in{" "}
                <code>.env</code>
              </li>
              <li>Make sure the database password is correct</li>
              <li>
                If you’re using Supabase, confirm you copied the connection
                string from the project’s database settings
              </li>
            </ul>
          </>
        ) : null}

        <pre
          style={{
            background: "#111",
            color: "#eee",
            padding: 12,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg}
        </pre>

        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

