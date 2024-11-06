/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import type { TagListResp } from '@/types/tag';
import { Get } from "@/utils/request/request";

const Api = {
  List: '/tag/list',
};

// 获取列表
function listTag(): Promise<[any, TagListResp | undefined]> {
  return Get(Api.List);
}


export const tagApis = { listTag };
