
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; 

export const signRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sign.findMany();
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const sign = await ctx.prisma.sign.findUnique({
        where: { id: input.id },
      });

      if (!sign) throw new TRPCError({ code: "NOT_FOUND" });

      return (await sign);
    }),

});
  