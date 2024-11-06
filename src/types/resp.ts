interface OperationResponse {
  code: number;
  msg: string;
}

interface CountResponse {
  code: number;
  count: number;
}

export type { CountResponse, OperationResponse };
