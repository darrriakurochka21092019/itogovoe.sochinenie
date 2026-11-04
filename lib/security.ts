import {timingSafeEqual} from 'node:crypto';
import {derivePasswordKey as derive} from './password-kdf';
const enc=new TextEncoder();
export const randomToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
export const uid=()=>crypto.randomUUID();
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(value))),b=>b.toString(16).padStart(2,'0')).join('')}
// OWASP PBKDF2-HMAC-SHA256 work factor. Random per-password salt.
export async function hashPassword(password:string){const salt=randomToken();const hash=await derive(password,salt,600000);return `pbkdf2-sha256$600000$${salt}$${hash.toString('hex')}`}
export async function verifyPassword(password:string,stored:string){const [method,count,salt,expected]=stored.split('$');const iterations=Number(count);if(method!=='pbkdf2-sha256'||!salt||!/^[a-f0-9]{64}$/.test(expected||'')||!Number.isInteger(iterations)||iterations<100000||iterations>2000000)return false;return timingSafeEqual(await derive(password,salt,iterations),Buffer.from(expected,'hex'))}
export function passwordValid(value:unknown){return typeof value==='string'&&value.length>=12&&value.length<=200}
