declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: {
        description?: string
        fatal?: boolean
        [key: string]: string | number | boolean | undefined
      }
    ) => void
  }
}

export {}