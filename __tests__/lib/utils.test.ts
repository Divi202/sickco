import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-4 py-2', 'bg-blue-500', 'text-white')
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
      expect(result).toContain('bg-blue-500')
      expect(result).toContain('text-white')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should handle false conditional classes', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).not.toContain('active-class')
    })

    it('should merge conflicting Tailwind classes correctly', () => {
      const result = cn('px-4', 'px-6')
      // tailwind-merge should keep only the last px class
      expect(result).toContain('px-6')
      expect(result).not.toContain('px-4')
    })
  })
})