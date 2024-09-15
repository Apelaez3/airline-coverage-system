import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Aeropuerto } from '../../aeropuerto/entities/aeropuerto.entity';

@Entity()
export class Aerolinea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    descripcion: string;

    @Column('date')
    fechaDeFundacion: Date;

    @Column('text')
    paginaWeb: string;

    @ManyToMany(() => Aeropuerto, aeropuerto => aeropuerto.aerolineas)
    @JoinTable()
    aeropuertos: Aeropuerto[];



}
