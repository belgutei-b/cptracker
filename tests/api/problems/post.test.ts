// tests/api/problems/post.test.ts
import { vi, describe, it, expect } from "vitest";
import { testUser, prisma } from "@/tests/setup";

vi.mock("@/lib/user", () => ({
  getCurrentUserId: vi.fn(),
}));


import { getCurrentUserId } from "@/lib/user";
import { POST } from "@/app/api/problems/route";

describe("POST /api/problems", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);

    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        problemLink: "https://leetcode.com/problems/two-sum/",
      }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it("returns 400 when problemLink is missing", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("returns 200 and persists the problem on happy path", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        problemLink: "https://leetcode.com/problems/two-sum/",
      }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.problem).toBeDefined();
    expect(body.problem.problem.titleSlug).toBe("two-sum");
    expect(body.problem.userId).toBe(testUser.id);

    const row = await prisma.userProblem.findFirst({
      where: { userId: testUser.id },
      include: { problem: true },
    });
    expect(row).not.toBeNull();
    expect(row!.problem.titleSlug).toBe("two-sum");
  });
});
