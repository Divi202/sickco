import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}))

describe('Login Page', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('allows user to type in email and password fields', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*/)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('shows signup link', () => {
    render(<LoginPage />)
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })
})