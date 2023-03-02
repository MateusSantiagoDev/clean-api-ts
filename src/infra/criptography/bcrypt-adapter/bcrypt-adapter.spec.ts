import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt, { compare } from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }  
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  // integração
  test('Deve chamar hash com valores corretos', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('valid_password') 
    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt)
  })

  // excessão
  test('Deve falhar se o bcrypt falhar', async () => {
    const sut = makeSut()
    jest.spyOn<any, string>(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.hash('any_password')
    await expect(promise).rejects.toThrow()
  })

  // sucesso
  test('Deve retornar um hash no caso de sucesso', async () => {
    const sut = makeSut()
    const hashed = await sut.hash('valid_password')
    expect(hashed).toEqual('hash')
  })

  // integração
  test('Deve chamar campare com valores corretos', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Deve retornar falso quando a comparação falhar', async () => {
    const sut = makeSut()
    jest.spyOn<any, string>(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  // excessão
  test('Deve falhar se o campare falhar', async () => {
    const sut = makeSut()
    jest.spyOn<any, string>(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })

  // sucesso
  test('Deve retornar true quando a comparação for bem-sucedida', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })
})