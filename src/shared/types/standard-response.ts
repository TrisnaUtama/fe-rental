export interface IResponseGlobal<T> {
  success: boolean;
  message: string;
  data: T;
}