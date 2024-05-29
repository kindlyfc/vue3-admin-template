import type { PermissionType } from '@/core/permission/modules/types';

// declare module '*.vue' {
//     import * as vue from 'vue';
//     export declare const render: vue.RootRenderFunction<Element | DocumentFragment>
// }

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $auth: (perm: string) => boolean;
    $personTypeMap: Record<string, string>;
    $personTypeOptions: { label: string; value: string }[];
    $riskLevelOptions: { value: number; label: string }[];
    $ageOptions: { value: string; label: string }[];
    $idCardTypeOptions: { value: number; label: string }[];
    $idCardTypeMap: { [key: number]: string };
    $getImgAdress: (str: string) => str;
    Reflect: Reflect;
  }
}

declare type Nullable<T> = T | null;

declare type CustomizedHTMLElement<T> = HTMLElement & T;

declare type Indexable<T> = {
  [key: string]: T;
};
