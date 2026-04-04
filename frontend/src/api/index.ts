import { type EffectCallback, useRef, useEffect } from "react";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import { type ErrorResponse } from "react-router-dom";
import type { Photo, ResponseDto } from "@shared";

export const TOKEN_NAME = "myweb_admin_token";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_NAME);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(TOKEN_NAME);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

interface ThrowErrorResponse extends ErrorResponse {
  data: AxiosError;
}

const throwInRouter = <T>(error: AxiosError<ResponseDto<T>>): never => {
  const axiosError: AxiosError = error;
  const apiError = error.response?.data;

  const throwObject: ThrowErrorResponse = {
    status: apiError === undefined ? 500 : apiError.code,
    statusText: apiError === undefined ? axiosError.message : apiError.message,
    data: axiosError,
  };

  throw throwObject;
};

const fetchApi = async <T>(url: string): Promise<ResponseDto<T>> => {
  const result: ResponseDto<T> = await instance
    .get(url)
    .then((res: AxiosResponse) => {
      return res.data satisfies ResponseDto<T>;
    })
    .catch((error: AxiosError<ResponseDto<T>>) => {
      throwInRouter(error);
    });

  return result;
};

const uploadApi = async <T>(
  url: string,
  formData: FormData,
): Promise<ResponseDto<T>> => {
  const result: ResponseDto<T> = await instance
    .post(url, formData)
    .then((res: AxiosResponse) => {
      return res.data satisfies ResponseDto<T>;
    })
    .catch((error: AxiosError<ResponseDto<T>>) => {
      throwInRouter(error);
    });

  return result;
};

const deleteApi = async <T>(url: string): Promise<ResponseDto<T>> => {
  const result: ResponseDto<T> = await instance
    .delete(url)
    .then((res: AxiosResponse) => {
      return res.data satisfies ResponseDto<T>;
    })
    .catch((error: AxiosError<ResponseDto<T>>) => {
      throwInRouter(error);
    });

  return result;
};

const patchApi = async <T>(
  url: string,
  data: Partial<T>,
): Promise<ResponseDto<T>> => {
  const result: ResponseDto<T> = await instance
    .patch(url, data)
    .then((res: AxiosResponse) => {
      return res.data satisfies ResponseDto<T>;
    })
    .catch((error: AxiosError<ResponseDto<T>>) => {
      throwInRouter(error);
    });

  return result;
};

export const useOnMountUnsafe = (effect: EffectCallback): void => {
  const initialized = useRef(false);
  const effectRef = useRef(effect);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      return effectRef.current();
    }
  }, []);
};

export const login = async (
  password: string,
): Promise<ResponseDto<{ token: string }>> => {
  const result = await instance
    .post<ResponseDto<{ token: string }>>("/api/admin/login", { password })
    .then((res) => res.data)
    .catch((error) => throwInRouter(error));

  return result;
};

export const getPhotos = () => fetchApi<Photo[]>("/api/photos");
export const getPhoto = (id: string) => fetchApi<Photo>(`/api/photos/${id}`);
export const uploadPhoto = (formData: FormData) =>
  uploadApi<Photo>(`/api/admin/upload`, formData);
export const deletePhoto = (id: string) =>
  deleteApi<Photo>(`/api/admin/photos/${id}`);
export const updatePhoto = (id: string, newFile: Partial<Photo>) =>
  patchApi(`/api/admin/photos/${id}`, newFile);
