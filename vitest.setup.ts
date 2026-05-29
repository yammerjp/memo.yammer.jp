import { vi } from 'vitest'

// Mock CSS modules
vi.mock('*.module.css', () => {
  return new Proxy(
    {},
    {
      get: (target, key) => {
        if (key === '__esModule') {
          return false
        }
        return key
      },
    }
  )
})
