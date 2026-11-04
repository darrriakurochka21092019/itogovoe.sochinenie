export const taskTypes:Record<string,string>={choice:'Выбор ответа',match:'Установление соответствия',order:'Восстановление последовательности',error:'Найди ошибку',truefalse:'Правда или вымысел',argument:'Конструктор аргумента',short:'Краткий письменный ответ',essay:'Полное сочинение'};
export const statuses:Record<string,string>={completed:'Выполнено',incorrect:'Есть ошибки',pending:'Ожидает проверки',revision:'Требуется доработка',accepted:'Принято',available:'Доступно',locked:'Пока закрыто'};
export const criteriaNames=['Соответствие теме','Аргументация. Привлечение литературного материала','Композиция и логика рассуждения','Качество письменной речи','Грамотность'];
export type Row=Record<string,any>;
export interface AppDB{prepare(sql:string):{bind(...args:any[]):any;first<T=Row>():Promise<T|null>;all<T=Row>():Promise<{results:T[]}>;run():Promise<any>};batch(statements:any[]):Promise<any[]>}
export interface AppEnv{DB:AppDB;BUCKET:any;SETUP_TOKEN?:string;APP_ORIGIN?:string;STANDALONE?:string}
