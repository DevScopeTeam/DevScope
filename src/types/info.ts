interface UserInfo {
  avatar_url: string;
  events_url?: string;
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  gravatarid?: string;
  html_url?: string;
  id: number;
  nodeid: string;
  login: string;
  organizations_url?: string;
  receivedevents_url?: string;
  repos_url?: string;
  siteadmin?: boolean;
  starred_url?: string;
  subscriptions_url?: string;
  type?: string;
  url: string;
  bio?: string;
  blog?: string;
  company?: string;
  email?: string;
  followers?: number;
  following?: number;
  hireable?: boolean;
  location?: string;
  name: string;
  publicgists?: number;
  publicrepos?: number;
  createdat?: Date;
  updatedat?: Date;
  collaborators?: number;
  diskusage?: number;
  ownedprivaterepos?: number;
  privategists?: number;
  totalprivaterepos?: number;
  twofactorauthentication?: boolean;
}

interface UserInfoResp {
  code: number;
  user: UserInfo;
}

export type { UserInfo, UserInfoResp };
