import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'customer',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  google_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name?: string;

  @Column({ type: 'longtext', nullable: true })
  avatar_url?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  current_hashed_refresh_token?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at!: Date;
}
