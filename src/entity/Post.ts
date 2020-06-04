import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { User } from "./User";
@Entity()
@Unique(["title"])
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "The tilte is required" })
  @Length(10, 200)
  title: string;

  @Column()
  @IsNotEmpty({ message: "The content is required" })
  @Length(10, 2000)
  content: string;

  @Column()
  user_id: number;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  tag: string;
}
