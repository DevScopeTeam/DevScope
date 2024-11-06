import { rankApis } from './rank'
import { githubApis } from './github'

export const api = {
  ...rankApis,
  ...githubApis,
}
