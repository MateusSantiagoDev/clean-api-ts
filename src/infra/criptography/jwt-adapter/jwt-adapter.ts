import Jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}
  
  // criptografar
  async encrypt(value: string): Promise<string> {
    const acessToken = await Jwt.sign({ id: value }, this.secret) 
    return acessToken   
  }

  // desencriptografar
  async decrypt (token: string): Promise<string> {
    const value: any = await Jwt.verify(token, this.secret)
    return value
  }
}