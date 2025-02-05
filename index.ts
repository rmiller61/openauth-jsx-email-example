import { Hono } from "hono";

const app = new Hono().get("/*", async (c) => {
  const key = crypto.randomUUID();
  return c.json({ key });
});

export default app;
