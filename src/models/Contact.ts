import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



export enum LINKEDPRECEDENCE {
    PRIMARY,
    SECONDARY
}


/**
 * Contact - ORM for contact Entity for storing in DB
 */
@Entity({
    name: "contact",
    synchronize: true
})
export class Contact {

    @PrimaryGeneratedColumn({
        type: "int",
    })
    id?: number

    @PrimaryColumn()
    phoneNumber!: string

    @PrimaryColumn()
    email!: string

    @Column({
        type: "varchar",
        nullable: true
    })
    linkedId!: number| null

    @Column({
        type: 'enum',
        enum: LINKEDPRECEDENCE,
    })
    linkPrecedence!: LINKEDPRECEDENCE

    @CreateDateColumn()
    createdAt? : Date

    @UpdateDateColumn()
    updatedAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date

}

// {
// 	id                   Int                   
//   phoneNumber          String?
//   email                String?
//   linkedId             Int? // the ID of another Contact linked to this one
//   linkPrecedence       "secondary"|"primary" // "primary" if it's the first Contact in the link
//   createdAt            DateTime              
//   updatedAt            DateTime              
//   deletedAt            DateTime?
// }