import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
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
})