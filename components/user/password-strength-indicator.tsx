import { cn } from '@/lib/utils';

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /[0-9]/, text: 'One number' },
    { regex: /[^A-Za-z0-9]/, text: 'One special character' },
  ];

  const strength = requirements.reduce(
    (count, requirement) => count + (requirement.regex.test(password) ? 1 : 0),
    0,
  );

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength < 3) return 'Weak';
    if (strength < 5) return 'Medium';
    return 'Strong';
  };

  const strengthColor = {
    Weak: 'text-red-500',
    Medium: 'text-yellow-500',
    Strong: 'text-green-500',
  };

  const strengthText = getStrengthText();

  return (
    <div className="space-y-2">
      {password && (
        <>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'text-xs font-medium',
                strengthText
                  ? strengthColor[strengthText as keyof typeof strengthColor]
                  : 'text-muted-foreground',
              )}
            >
              {strengthText}
            </div>
          </div>

          {/* Strength bar indicator */}
          <div className="h-1.5 w-full rounded bg-muted">
            <div
              className={cn(
                'h-1.5 rounded transition-all duration-300',
                strength === 0 && 'w-0',
                strength > 0 && strength < 3 && 'w-1/3 bg-red-500',
                strength >= 3 && strength < 5 && 'w-2/3 bg-yellow-500',
                strength === 5 && 'w-full bg-green-500',
              )}
            />
          </div>

          {/* Guidance text */}
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters, including uppercase, lowercase, number, and symbol for a
            strong password.
          </p>
        </>
      )}
    </div>
  );
}
