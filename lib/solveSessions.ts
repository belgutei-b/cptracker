// import "server-only";

import prisma from "@/lib/prisma";

export async function getSolveSessions({ userId }: { userId: string }) {
  const sessions = await prisma.solveSession.findMany({
    where: {
      userProblem: {
        userId: userId,
      },
    },
    select: {
      userProblem: {
        select: {
          id: true,
          problem: {
            select: {
              title: true,
              link: true,
              difficulty: true,
            },
          },
        },
      },
      startedAt: true,
      finishedAt: true,
      userProblemId: true,
      duration: true,
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  return sessions;
}
