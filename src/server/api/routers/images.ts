import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"; 

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rollingImage.findMany({
      take: 100,
      orderBy: { createdAt: "asc" },
    });
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const image = await ctx.prisma.rollingImage.findUnique({
        where: { id: input.id },
      });

      if (!image) throw new TRPCError({ code: "NOT_FOUND" });

      return (image);
    }),
    getLastImage: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.rollingImage.findFirst({
        take: 1,
        orderBy: { createdAt: "desc" },
      });
    }),
    getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const image = await ctx.prisma.rollingImage.findUnique({
        where: { imageName: input.name },
      });

      if (!image) throw new TRPCError({ code: "NOT_FOUND" });

      return (image);
    }),
    create: privateProcedure
    .input(
      z.object({
        imageName: z.string().min(1).max(280),
        imageUrl: z.string().min(1).max(280),
        durationHour: z.number().min(0).max(24),
        durationMinute: z.number().min(0).max(60),
        durationSecond: z.number().min(0).max(60),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.rollingImage.create({
        data: {
          imageName: input.imageName,
          imageUrl: input.imageUrl,
          createdAt: new Date(),
          uploadedBy: "admin",
          durationHour: input.durationHour,
          durationMinute: input.durationMinute,
          durationSecond:  input.durationSecond,
        },
      });
      return image;
    }),
    update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        imageName: z.string().min(1).max(280),
        imageUrl: z.string().min(1).max(280),
        createdAt: z.date(),
        uploadedBy: z.string().min(1).max(280),
        durationHour: z.number().min(0).max(24),
        durationMinute: z.number().min(0).max(60),
        durationSecond: z.number().min(0).max(60),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const image = await ctx.prisma.rollingImage.update({
        where: { id: input.id },
        data: {
          imageName: input.imageName,
          imageUrl: input.imageUrl,
          createdAt: input.createdAt,
          uploadedBy: input.uploadedBy,
          durationHour: input.durationHour,
          durationMinute: input.durationMinute,
          durationSecond:  input.durationSecond,
        },
      });
      return image;
    }),
    delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.rollingImage.delete({
        where: { id: input.id },
      });
      return image;
    }),
});
