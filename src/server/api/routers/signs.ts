
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const signRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sign.findMany();
  }),
});
