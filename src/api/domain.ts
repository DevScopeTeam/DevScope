/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import type { UserDomainResp } from '@/types/domain';
import type { DeveloperRankListResp } from '@/types/TalentRank';
import { Get } from "@/utils/request/request";

const Api = {
  List: '/domain/list',
  User: '/domain/user',
};

// 获取领域排名
function listDomainRank(tag_uuid: string, page: number = 1, page_size: number = 10): Promise<[any, DeveloperRankListResp | undefined]> {
  return Get(Api.List, { tag_uuid, page, page_size });
}

// 获取用户领域
function getUserDomain(username: string): Promise<[any, UserDomainResp | undefined]> {
  return Get(Api.User, { username });
}

export const domainApis = { listDomainRank, getUserDomain };
