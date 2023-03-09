import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },

  async verify (): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }

}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    // integração
    test('Deve chamar o Sign com os valores corretos', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    // excessão
    test('Deve falhar se o Sign falhar', async () => {
      const sut = makeSut()
      jest.spyOn<any, string>(jwt, 'sign').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })

    // sucesso
    test('Deve retornar um token no sucesso do Sign', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toEqual('any_token')
    })
  })

  describe('verify()', () => {

    // integração - desencriptação da senha
    test('Deve chamar o verify com os valores corretos', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
  })
 
})