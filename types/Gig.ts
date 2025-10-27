export type Gig = {
  id?: string
  ownerUid: string
  title: string
  description: string
  category: string
  budget: number
  region: string
  province: string
  city: string
  barangay?: string
  dueDate?: string
  createdAt?: any
  updatedAt?: any
  images: string[]
  status: 'open' | 'assigned' | 'done' | 'cancelled'
}
