/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.address)
    user: UserEntity;
}

export default Address;