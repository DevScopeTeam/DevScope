import { rankApis } from './rank'
import { githubApis } from './github'
import { domainApis } from './domain'
import { tagApis } from './tag'

export const api = {
  ...rankApis,
  ...githubApis,
  ...domainApis,
  ...tagApis,
}
