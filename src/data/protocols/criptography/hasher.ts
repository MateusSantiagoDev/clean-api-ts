
// cria uma hash para o password
export interface Hasher {
  hash (value: string): Promise<string>
}