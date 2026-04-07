import { createApp } from "./app.js";

const PORT = Number(process.env.PORT) || 4001;

async function main() {
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`BFF listening on http://localhost:${PORT}`);
    console.log(
      `Local routes under /api/<segment>/... (from server/src/routers), then proxy → ${process.env.BACKEND_URL ?? "https://soupcircle-backend.vercel.app"}${process.env.BACKEND_STRIP_API_PREFIX === "true" ? " (strip /api)" : ""}`
    );
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
