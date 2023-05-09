
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
    getLastSign: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.sign.findFirst({
        take: 1,
        orderBy: { number: "desc" },
      });
    }),
    create: privateProcedure
    .input(
      z.object({
        signName: z.string().min(1).max(280),
        signNumber: z.number().min(1).max(100),
        signWidth: z.number().min(1).max(10000),
        signHeight: z.number().min(1).max(10000),
        signType: z.string().min(5).max(20),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        emergencyNotificationEnabled: z.boolean(),
        customContentEnabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sign = await ctx.prisma.sign.create({
        data: {
          name: input.signName,
          number: input.signNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
          width: input.signWidth,
          height: input.signHeight,
          type: input.signType,
          customContentId: "customContentId",
          latitude: input.latitude,
          longitude: input.longitude,
          emergencyNotificationEnabled: input.emergencyNotificationEnabled,
          customContentEnabled: input.customContentEnabled,
        },
      });
      return sign;
    }),
    update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        signName: z.string().min(1).max(10000),
        signNumber: z.number().min(1).max(100),
        signWidth: z.number().min(1).max(10328),
        signHeight: z.number().min(1).max(10328),
        signType: z.string().min(5).max(20),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        emergencyNotificationEnabled: z.boolean(),
        customContentEnabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const sign = await ctx.prisma.sign.update({
        where: { id: input.id },
        data: {
          name: input.signName,
          number: input.signNumber,
          updatedAt: new Date(),
          width: input.signWidth,
          height: input.signHeight,
          type: input.signType,
          customContentId: "customContentId",
          latitude: input.latitude,
          longitude: input.longitude,
          emergencyNotificationEnabled: input.emergencyNotificationEnabled,
          customContentEnabled: input.customContentEnabled,
        },
      });
      return sign;
    })
});
