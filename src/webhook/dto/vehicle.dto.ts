import { IsNumber, IsString, Min, Max } from 'class-validator';

export class VehicleDto {
  @IsString()
  id!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;

  @IsNumber()
  @Min(0)
  capacity!: number;
}
