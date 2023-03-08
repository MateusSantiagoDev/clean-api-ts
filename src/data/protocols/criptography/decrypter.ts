// pega uma string cryptografada e retorna au valor original
export interface Decrypter {
  decrypt (value: string): Promise<string>
}