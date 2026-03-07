import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { VehicleDto } from './vehicle.dto';
import { StopDto } from './stop.dto';

export class WebhookEventDto {
  @IsString()
  @IsIn(['traffic_jam', 'new_order', 'vehicle_breakdown', 'weather_change'])
  eventType!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => VehicleDto)
  vehicles!: VehicleDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => StopDto)
  stops!: StopDto[];
}
