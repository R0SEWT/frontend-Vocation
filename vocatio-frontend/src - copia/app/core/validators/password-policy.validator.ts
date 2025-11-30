const policies = [
  {
    test: (pwd: string) => pwd.length >= 8,
    message: 'La contraseña debe tener al menos 8 caracteres'
  },
  {
    test: (pwd: string) => /[0-9]/.test(pwd),
    message: 'La contraseña debe incluir al menos un número'
  },
  {
    test: (pwd: string) => /[A-Z]/.test(pwd),
    message: 'La contraseña debe incluir al menos una letra mayúscula'
  },
  {
    test: (pwd: string) => /[a-z]/.test(pwd),
    message: 'La contraseña debe incluir al menos una letra minúscula'
  }
];

export function getPasswordPolicyErrors(password: string): string[] {
  if (!password) {
    return policies.map((item) => item.message);
  }
  return policies.filter((item) => !item.test(password)).map((item) => item.message);
}

export function passwordMeetsPolicy(password: string): boolean {
  return getPasswordPolicyErrors(password).length === 0;
}
