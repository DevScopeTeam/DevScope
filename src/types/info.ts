interface UserInfo {
  avatarurl: string;
  eventsurl: string;
  followersurl: string;
  followingurl: string;
  gistsurl: string;
  gravatarid: string;
  htmlurl: string;
  id: number;
  nodeid: string;
  login: string;
  organizationsurl: string;
  receivedeventsurl: string;
  reposurl: string;
  siteadmin: boolean;
  starredurl: string;
  subscriptionsurl: string;
  type: string;
  url: string;
  bio?: string;
  blog?: string;
  company?: string;
  email?: string;
  followers: number;
  following: number;
  hireable: boolean;
  location?: string;
  name: string;
  publicgists: number;
  publicrepos: number;
  createdat: Date;
  updatedat: Date;
  collaborators: number;
  diskusage: number;
  ownedprivaterepos: number;
  privategists: number;
  totalprivaterepos: number;
  twofactorauthentication: boolean;
}

interface UserInfoResp {
  code: number;
  user: UserInfo;
}

export type { UserInfo, UserInfoResp };
