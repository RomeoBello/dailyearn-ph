// Simple Haversine distance in kilometers
export function distanceKm(a:{lat:number,lng:number}, b:{lat:number,lng:number}){
  const toRad=(x:number)=>x*Math.PI/180
  const R=6371
  const dLat=toRad(b.lat-a.lat), dLon=toRad(b.lng-a.lng)
  const lat1=toRad(a.lat), lat2=toRad(b.lat)
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2
  return 2*R*Math.asin(Math.sqrt(h))
}
export function getBrowserLocation(): Promise<{lat:number,lng:number}>{
  return new Promise((resolve, reject)=>{
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy:true, timeout:10000, maximumAge:60000 }
    )
  })
}
