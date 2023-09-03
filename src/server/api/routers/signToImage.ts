import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"; 

export const signToImageRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.signToRollingImage.findMany({
      take: 100,
    });
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const signToRollingImage = await ctx.prisma.signToRollingImage.findUnique({
        where: { id: input.id },
      });

      if (!signToRollingImage) throw new TRPCError({ code: "NOT_FOUND" });

      return (signToRollingImage);
    }),
    getBySignId: publicProcedure
    .input(z.object({ signId: z.string() }))
    .query(async ({ ctx, input }) => {
      const signToRollingImage = await ctx.prisma.signToRollingImage.findMany({
        where: { signId: input.signId },
        take: 100,
      });

      if (!signToRollingImage) throw new TRPCError({ code: "NOT_FOUND" });

      return (signToRollingImage);
    }),
    create: privateProcedure
    .input(
      z.object({
        signId: z.string().min(1).max(280),
        rollingImageId: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sign = await ctx.prisma.signToRollingImage.create({
        data: {
        sign: { connect: { id: input.signId } }, // Connect to the Sign by ID
        rollingImage: { connect: { id: input.rollingImageId } }, 
        },
      });
      return sign;
    }),
    delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const signToRollingImage = await ctx.prisma.signToRollingImage.delete({
        where: { id: input.id },
      });
      return signToRollingImage;
    }),
});
