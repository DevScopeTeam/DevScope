// define type of object
interface TalentRank {
  id: number, // userid
  login: string, // username(search key)
  nation: string, // nation

  // TalentRank-related
  project: number,
  code: number,
  influence: number,
  overall: number
}

interface DeveloperRank {
  Username: string;
  ProjectImportance: number;
  CodeContribution: number;
  CommunityInfluence: number;
  Overall: number;
  Nation?: string;
  UpdatedAt?: string;
}

interface DeveloperRankListResp {
  code: number;
  list: DeveloperRank[];
}

interface DeveloperScoreResp {
  code: number;
  score: DeveloperRank;
}

export type { TalentRank, DeveloperRank, DeveloperRankListResp, DeveloperScoreResp };
