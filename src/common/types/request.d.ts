
import { UserEntity } from "src/modules/user/entity/user.entity"



export {}
declare global {
    namespace Express {
        export interface Request {
            user?: UserEntity,
            admin?: UserEntity,
            superAdmin?: UserEntity,
           
        }
    }
}
// declare module "express-serve-static-core" {
//     export interface Request {
//         user?: {id:string}
//     }
// }