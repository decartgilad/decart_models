import { redirect } from 'next/navigation'
import { MODELS } from '@/config/registry'

export default function Home() {
  const firstEnabledModel = MODELS.find(m => m.enabled)
  redirect(`/models/${firstEnabledModel?.slug || 'lucy-14b'}`)
  return null
}
