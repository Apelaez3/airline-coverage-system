import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Aerolinea } from '../../aerolinea/entities/aerolinea.entity';

@Entity()
export class Aeropuerto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    codigo: string;

    @Column('text')
    pais: string;

    @Column('text')
    ciudad: string;

    @ManyToMany(() => Aerolinea, aerolinea => aerolinea.aeropuertos)
    aerolineas: Aerolinea[];
    
}
