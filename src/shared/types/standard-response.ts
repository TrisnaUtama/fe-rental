export interface IResponseGlobal<T> {
  some(arg0: (v: any) => boolean): unknown;
  success: boolean;
  message: string;
  data: T;
}