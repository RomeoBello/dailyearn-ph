import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { geohashForLatLng } from './geo'
export async function createGig(d:any,uid:string){const geo=(d.lat&&d.lng)?{lat:d.lat,lng:d.lng,geohash:geohashForLatLng(d.lat,d.lng)}:null;return addDoc(collection(db,'gigs'),{title:d.title,desc:d.desc,price:d.price,currency:d.currency,ownerId:uid,createdAt:serverTimestamp(),status:'open',loc:{region:d.region,province:d.province,city:d.city,barangay:d.barangay||''},geo,images:d.images||[]})}