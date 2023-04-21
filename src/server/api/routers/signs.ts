
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"; 

export const signRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sign.findMany({
      take: 100,
      orderBy: { number: "asc" },
    });
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const sign = await ctx.prisma.sign.findUnique({
        where: { id: input.id },
      });

      if (!sign) throw new TRPCError({ code: "NOT_FOUND" });

      return (sign);
    }),

    create: privateProcedure
    .input(
      z.object({
        signName: z.string().min(1).max(280),
        signNumber: z.number().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sign = await ctx.prisma.sign.create({
        data: {
          name: input.signName,
          number: input.signNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
          width: 1080,
          height: 1920,
        },
      });

      return sign;
    }),
});
