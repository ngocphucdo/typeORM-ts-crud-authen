import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column()
  resource: string;

  @Column()
  method: string;

  @Column()
  type: string;
}
