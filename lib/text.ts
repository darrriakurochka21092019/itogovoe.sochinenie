export function wordCount(text:string){return (text.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)||[]).length}

export function pluralRu(n:number,forms:[string,string,string]){const a=Math.abs(n)%100,b=a%10;return a>10&&a<20?forms[2]:b===1?forms[0]:b>=2&&b<=4?forms[1]:forms[2]}
