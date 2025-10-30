import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
export async function addTx(uid:string,type:'credit'|'debit'|'fee',amount:number,note:string){
 return addDoc(collection(db,'wallet',uid,'transactions'),{type,amount,currency:'PHP',note,createdAt:serverTimestamp()}) }