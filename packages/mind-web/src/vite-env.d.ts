/// <reference types="vite/client" />

declare module "random-graph";
declare module "zero-colors";

/**
 * 下拉项、lookUp、状态的枚举接口
 * @interface IStatusEnum
 * @template T
 */
interface IStatusEnum<T = string> {
  title: string;
  value: T;
  color?: string;
  icon?: React.ReactNode;
}
