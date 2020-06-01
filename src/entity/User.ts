import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "The email is required" })
  @IsEmail({}, { message: "Incorrect email" })
  email: string;

  @Column()
  @IsNotEmpty({ message: "The name is required" })
  @Length(6, 20)
  name: string;

  @Column()
  @IsNotEmpty({ message: "The password is required" })
  @Length(8, 100)
  password: string;

  @Column({ default: "USER" })
  role: string;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
