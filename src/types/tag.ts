interface Tag {
  uuid: string;
  name: string;
}

interface TagResp {
  code: number;
  tag: Tag;
}

interface TagListResp {
  code: number;
  list: Tag[];
}

export type {
  Tag,
  TagResp,
  TagListResp
}