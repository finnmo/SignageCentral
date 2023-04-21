import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from '../api/root';
import { prisma } from '../db';

export const generateSSGHelper = () => 
createServerSideHelpers({
  router: appRouter,
  ctx: { prisma, userId: '0' },
  transformer: superjson, // optional - adds superjson serialization
});
