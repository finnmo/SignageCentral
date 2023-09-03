import { createTRPCRouter } from "~/server/api/trpc";
import { signRouter } from "./routers/signs";
import { imageRouter } from "./routers/images";
import { pingRouter } from "./routers/monitor";
import { signToImageRouter } from "./routers/signToImage";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sign: signRouter,
  image: imageRouter,
  signToImage: signToImageRouter,
  ping: pingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

