/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { handleNetworkError } from './RequestTools'
import { baseURL } from '@/constants/server'
import type { IAnyObj } from '@/types/type'

export enum requestIndexs {
  request = 0,
  authRequest = 1
}

export type HTTPMethod = 'GET' | 'POST' | 'DELETE'

type RequestFunction<T extends HTTPMethod> = T extends 'GET'
  ? <R>(url: string, params?: IAnyObj) => Promise<[any, R | undefined]>
  : T extends 'POST'
  ? <R>(url: string, data: IAnyObj, params?: IAnyObj) => Promise<[any, R | undefined]>
  : T extends 'DELETE'
  ? <R>(url: string, params?: IAnyObj) => Promise<[any, R | undefined]>
  : never

export const requests = [
  axios.create({
    baseURL: baseURL,
    timeout: 10000,
    responseType: 'json'
  }),
]

requests.map((request) => {
  // 配置请求头
  request.interceptors.request.use((config) => {
    return config
  })

  request.interceptors.response.use(
    (response) => {
      if (response.status !== 200) return Promise.reject(response.data)
      return response
    },
    (err) => {
      console.log(err.response)
      handleNetworkError(err.response.status)
      Promise.reject(err.response)
    }
  )
})

export function newRequestMethod<Type extends HTTPMethod>(
  requestIndex: requestIndexs,
  method: Type
): RequestFunction<Type> {
  const request = requests[requestIndex]
  switch (method) {
    case 'GET':
      return (<T>(url: string, params?: IAnyObj): Promise<[any, T | undefined]> => {
        if(!params) params = {}
        return new Promise((resolve) => {
          request
            .get(url, { params })
            .then((result) => {
              const res: T = result.data
              resolve([null, res])
            })
            .catch((err) => {
              resolve([err, undefined])
            })
        })
      }) as RequestFunction<Type>
    case 'POST':
      return (<T>(url: string, data: IAnyObj, params?: IAnyObj): Promise<[any, T | undefined]> => {
        if(!params) params = {}
        return new Promise((resolve) => {
          request
            .post(url, data, { params })
            .then((result) => {
              resolve([null, result?.data])
            })
            .catch((err) => {
              resolve([err, undefined])
            })
        })
      }) as RequestFunction<Type>
    case 'DELETE':
      return (<T>(url: string, params?: IAnyObj): Promise<[any, T | undefined]> => {
        if(!params) params = {}
        return new Promise((resolve) => {
          request
            .delete(url, { params })
            .then((result) => {
              resolve([null, result.data])
            })
            .catch((err) => {
              resolve([err, undefined])
            })
        })
      }) as RequestFunction<Type>
    default:
      throw new TypeError('传入的 method 类型有误,没有匹配的 http 方法')
  }
}

export const Get = newRequestMethod(requestIndexs.request, 'GET')
export const Post = newRequestMethod(requestIndexs.request, 'POST')
export const Delete = newRequestMethod(requestIndexs.request, 'DELETE')
export const Auth_Get = newRequestMethod(requestIndexs.authRequest, 'GET')
export const Auth_Post = newRequestMethod(requestIndexs.authRequest, 'POST')
export const Auth_Delete = newRequestMethod(requestIndexs.authRequest, 'DELETE')
