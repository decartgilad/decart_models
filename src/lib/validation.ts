const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value.trim())
}

export function validateJobId(value: string): string | null {
  const trimmed = value.trim()
  
  if (!trimmed) {
    return 'Job ID is required'
  }
  
  if (!isValidUUID(trimmed)) {
    return 'Job ID must be a valid UUID'
  }
  
  return null
}
