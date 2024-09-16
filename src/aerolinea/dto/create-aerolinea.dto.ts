import { IsNotEmpty, MinLength, IsString, IsDateString, IsUrl  } from 'class-validator';

export class CreateAerolineaDto {

    @IsString({ message: 'El nombre de la aerolínea debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre de la aerolínea es requerido' })
    nombre: string;

    @IsString({ message: 'La descripción de la aerolínea debe ser un texto' })
    @MinLength(1, { message: 'La descripción de la aerolínea debe tener al menos 1 caracter' })
    descripcion: string;

    @IsDateString()
    fechaDeFundacion: string;

    @IsUrl()
    paginaWeb: string;
}

