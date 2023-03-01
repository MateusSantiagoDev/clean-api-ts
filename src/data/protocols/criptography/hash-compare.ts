
// compara o pasword e a hash
export interface HashCompare {
  compare (value: string, hash: string): Promise<boolean>
}