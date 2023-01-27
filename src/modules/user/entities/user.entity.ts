import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { Column, Entity } from "typeorm";
import { UserRoleType } from "../enums/user-role.enum";
import type { User } from "../interfaces/user.interface";

@Entity(TableName.USER)
export class UserEntity extends BaseEntity implements User{
    @Column('varchar',{nullable:false})
    name!: string;
    
    @Column('varchar',{nullable:false})
    surname!: string
    
    @Column('varchar',{nullable:false,unique:true})
    email!: string;

    @Column('text', { unique:true , nullable: true})
    phone!: string | null

    @Column('varchar')
    password!: string;

    @Column('enum',{enum:UserRoleType,nullable:true, default:UserRoleType.USER})
    role!: UserRoleType | null;
} 