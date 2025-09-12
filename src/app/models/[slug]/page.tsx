import { getModelBySlug, MODELS } from '@/config/registry'
import { notFound } from 'next/navigation'
import { getModelView } from '@/features/models/registry'

export function generateStaticParams() {
  return MODELS.filter(model => model.enabled).map((model) => ({
    slug: model.slug,
  }))
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const model = getModelBySlug(slug)
  if (!model || !model.enabled) return notFound()
  const View = getModelView(model.slug)
  return <View model={model} />
}
