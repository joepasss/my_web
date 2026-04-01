import type { ResponseDto } from "@types";

export const sendResponse = <T>(res: any, status: number, message: string, data: T) => {
  const response: ResponseDto<T> = {
    code: status,
    message,
    data
  };

  return res.status(status).json(response);
}
