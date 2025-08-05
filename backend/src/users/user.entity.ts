import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['cpf'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  birthDate: Date;

  @Column({ nullable: true })
  placeOfBirth?: string;

  @Column({ nullable: true })
  nationality?: string;

  @Column()
  cpf: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}