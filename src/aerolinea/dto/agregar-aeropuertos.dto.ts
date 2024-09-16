import { IsArray, IsUUID } from "class-validator";

export class AgregarAeropuertosDto{
    @IsArray()
    @IsUUID('all', {each: true})
    aeropuertosIds: string[];
}