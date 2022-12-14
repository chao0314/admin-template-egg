// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBase from '../../../app/service/base';
import ExportHome from '../../../app/service/home';
import ExportPermission from '../../../app/service/permission';
import ExportRole from '../../../app/service/role';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    base: AutoInstanceType<typeof ExportBase>;
    home: AutoInstanceType<typeof ExportHome>;
    permission: AutoInstanceType<typeof ExportPermission>;
    role: AutoInstanceType<typeof ExportRole>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
