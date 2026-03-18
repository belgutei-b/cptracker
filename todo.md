### daily problem

[-] add daily problem

[-] post problem
[-] leetcode graphql (on 2 problems)
[-] daily problem

status flow can be:
any state (not solved) -> solved
solved (can't be changed into any state)

### unauthenticated user adding problem

[-] adding a problem (fail)

### user adding problem

[-] adding a problem
[-] adding a same problem (fail)

### testing solving flow

[-] start posted problem
[-] check the UserProblem status (in-progress)

[-] finish in-progress problem to invalid status (NOT-SOLVED | FAIL)
[-] check the UserProblem status (in-progress)

[-] finish in-progress problem (to TRIED)
[-] restart TRIED problem
[-] check the UserProblem status (TRIED)

[-] finish in-progress problem to valid status (SOLVED)
[-] check the UserProblem status (SOLVED)

[-] restart SOLVED problem (should fail)

### testing save notes api

[-] save todo problem

[-] start problem
[-] save in-progress problem

[-] finish problem (TRIED)
[-] save TRIED problem

[-] restart problem
[-] finish problem (SOLVED)
[-] save SOLVED problem
