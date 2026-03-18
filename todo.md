### testing save notes api

[-] 401 unauthenticated

[-] save nonexistent problem (400)

[-] save with invalid field types e.g. null note (400)

[-] save todo problem
[-] check saved values persisted (note, timeComplexity, spaceComplexity)
[-] check status unchanged (TODO)

[-] start problem
[-] save in-progress problem
[-] check saved values persisted
[-] check status unchanged (IN_PROGRESS)

[-] finish problem (TRIED)
[-] save TRIED problem
[-] check saved values persisted
[-] check status unchanged (TRIED)

[-] restart problem
[-] finish problem (SOLVED)
[-] save SOLVED problem
[-] check saved values persisted
[-] check status unchanged (SOLVED)

[-] overwrite: save again with different values, check new values are stored
