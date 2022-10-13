// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPermission from '../../../app/middleware/permission';

declare module 'egg' {
  interface IMiddleware {
    permission: typeof ExportPermission;
  }
}
