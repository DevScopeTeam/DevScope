// define type of object
export interface TalentRank {
  id: number, // userid
  login: string, // username(search key)

  // TalentRank-related
  project: number,
  code: number,
  influence: number,
  overall: number
}