import { createTRPCRouter } from "~/server/api/trpc";
import { signRouter } from "./routers/signs";
import { pingRouter } from "./routers/monitor";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sign: signRouter,
  ping: pingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

