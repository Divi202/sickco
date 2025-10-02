import { usersService } from '@/modules/users/users.service'
import { usersRepository } from '@/modules/users/users.repository'
import { ValidationError } from '@/lib/errors'

// Mock the repository
jest.mock('@/modules/users/users.repository', () => ({
  usersRepository: {
    login: jest.fn(),
    signup: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}))

const mockUsersRepository = usersRepository as jest.Mocked<typeof usersRepository>

describe('Users Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
      }
      
      const mockAuthData = {
        user: mockUser,
        session: {
          access_token: 'token',
          refresh_token: 'refresh',
          expires_at: 1234567890,
        },
      }

      mockUsersRepository.login.mockResolvedValue(mockAuthData)

      const result = await usersService.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toEqual({
        user: mockUser,
        session: {
          access_token: 'token',
          refresh_token: 'refresh',
          expires_at: 1234567890,
        },
      })
      expect(mockUsersRepository.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should throw ValidationError for missing email', async () => {
      await expect(
        usersService.login({
          email: '',
          password: 'password123',
        })
      ).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError for missing password', async () => {
      await expect(
        usersService.login({
          email: 'test@example.com',
          password: '',
        })
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('signup', () => {
    it('should successfully signup with valid data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
      }
      
      const mockAuthData = {
        user: mockUser,
        session: {
          access_token: 'token',
          refresh_token: 'refresh',
          expires_at: 1234567890,
        },
      }

      mockUsersRepository.signup.mockResolvedValue(mockAuthData)

      const result = await usersService.signup({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toEqual({
        user: mockUser,
        session: {
          access_token: 'token',
          refresh_token: 'refresh',
          expires_at: 1234567890,
        },
      })
    })

    it('should throw ValidationError for short password', async () => {
      await expect(
        usersService.signup({
          email: 'test@example.com',
          password: '123',
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})