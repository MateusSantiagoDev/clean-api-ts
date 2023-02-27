export interface AuthenticationDto {
  email: string
  password: string
}

export interface Authentication {
  auth (authentication: AuthenticationDto): Promise<string>
}