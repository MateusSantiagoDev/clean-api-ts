export interface hashCompare {
  compare (value: string, hash: string): Promise<string>
}