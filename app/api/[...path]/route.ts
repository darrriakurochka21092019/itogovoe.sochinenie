import { env } from 'cloudflare:workers';
import { handleApi } from '../../../lib/api';
import type { AppEnv } from '../../../lib/types';
export const dynamic='force-dynamic';
const handle=(request:Request)=>handleApi(request,env as unknown as AppEnv);
export {handle as GET,handle as POST,handle as PUT,handle as DELETE};
