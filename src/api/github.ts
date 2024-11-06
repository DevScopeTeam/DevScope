/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import type { UserInfoResp } from '@/types/info';
import type { DevNationalityResp } from '@/types/nation';
import { Get } from "@/utils/request/request";

const Api = {
  Event: '/github/user/events',
  Info: '/github/user/info',
  Nation: '/github/user/nation',
  Repo: '/github/user/repo',
  Repos: '/github/user/repos',
};

// 获取分数
function getNation(username: string): Promise<[any, DevNationalityResp | undefined]> {
  return Get(Api.Nation, { username });
}

// 获取个人Info
function getInfo(username: string): Promise<[any, UserInfoResp | undefined]> {
  return Get(Api.Info, { username });
}

export const githubApis = { getNation, getInfo };
