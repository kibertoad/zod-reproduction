## Zod regression reproduction

This repo illustrates a type enforcement regression from zod v3 to zod v4.

`repro.ts` includes the original code.
`repro-suggested-fix1.ts` and `repro-suggested-fix2.ts` include fixes suggested in https://github.com/colinhacks/zod/issues/4660#issuecomment-2957429631 and show that it still doesn't fully work

`repro-v3.ts` shows how exactly same code is passing with zod v3.
