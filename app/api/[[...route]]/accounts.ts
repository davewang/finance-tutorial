import { Hono } from 'hono'
import {db} from "@/db/drizzle"
import {eq} from "drizzle-orm"
import {createId} from "@paralleldrive/cuid2"
import {accounts, insertAccountSchema} from "@/db/schema"
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import {HTTPException} from "hono/http-exception"
import { zValidator } from '@hono/zod-validator';
 
const app = new Hono()
    .get('/',
        clerkMiddleware(),
        async (c) => {
        const auth = getAuth(c);
        if(!auth?.userId){
            
            //throw new HTTPException(401,{res: c.json({error:"Unauthoried!"},401)})
            return c.json({error:"Unauthoried"},401);
        }
        const data = await db
        .select({
            id: accounts.id,
            name: accounts.name,  
        })
        .from(accounts)
        .where(eq(accounts.userId,auth.userId));
        return c.json({data})
    })
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json",insertAccountSchema.pick({
            name:true,
        })),
        async (c) =>{
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if(!auth?.userId){
                
                //throw new HTTPException(401,{res: c.json({error:"Unauthoried!"},401)})
                return c.json({error:"Unauthoried"},401);
            }
            const [data] = await db.insert(accounts).values({
                id:createId(),
                userId:auth.userId,
                ...values
            }).returning();
            return c.json({
               data
            });
        });
// app.post('/', (c) => c.json('create an author', 201))
// app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app