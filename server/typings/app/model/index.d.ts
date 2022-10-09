// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPermissions from '../../../app/model/permissions';
import ExportRoles from '../../../app/model/roles';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Permissions: ReturnType<typeof ExportPermissions>;
    Roles: ReturnType<typeof ExportRoles>;
    User: ReturnType<typeof ExportUser>;
  }
}
