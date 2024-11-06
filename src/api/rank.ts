/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import type { DeveloperScoreResp, DeveloperRankListResp } from '@/types/TalentRank';
// import type { CountResponse, OperationResponse } from '@/types/resp';
// import { request } from '@/utils/request';
import { Get } from "@/utils/request/request";

const Api = {
  Score: '/rank/score',
  List: '/rank/list',
};

// const request_option = {
//   apiUrl: import.meta.env.VITE_Backend_URL,
// };

// 获取列表
function listRank(page: number = 1, page_size: number = 10): Promise<[any, DeveloperRankListResp | undefined]> {
  return Get(Api.List, { page, page_size });
}

// 获取分数
function getScore(username: string): Promise<[any, DeveloperScoreResp | undefined]> {
  return Get(Api.Score, { username });
}

export { listRank, getScore };
