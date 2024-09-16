import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAeropuertoDto {

    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre: string;

    @IsString({message: 'El campo código debe ser un string' })
    @MaxLength(3,{message: 'El campo código debe tener maximo 3 caracteres'})
    @MinLength(3,{message: 'El campo código debe tener minimo 3 caracteres'})
    codigo: string;

    @IsString({message: 'El campo país debe ser un string' })
    @MinLength(1,{message: 'El campo país no debe estar vacío'})
    pais: string;

    @IsString({message: 'El campo ciudad debe ser un string' })
    @MinLength(1,{message: 'El campo ciudad no debe estar vacío'})
    ciudad: string;
    
}
