import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc"; 
import ping from 'ping'

export const pingRouter = createTRPCRouter({  
  getOnline: privateProcedure
    .input(z.object({ ip: z.string() }))
    .query(async ({ input }) => {
        const isDeviceOnline = await checkDeviceOnline(input.ip);
        return isDeviceOnline;
    }),
  });

  async function checkDeviceOnline(ipAddress: string): Promise<boolean> {
    const pingResult = await ping.promise.probe(ipAddress);
    return pingResult.alive;
  }

