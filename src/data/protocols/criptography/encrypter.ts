
// gera um token de acesso
export interface Encrypter {
  encrypt (value: string): Promise<string>
}