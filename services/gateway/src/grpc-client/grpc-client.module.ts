import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GrpcClientService } from './grpc-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ROUTE_OPTIMIZER_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'optimizer',
            protoPath: join(__dirname, 'proto/route-optimizer.proto'),
            url: `${configService.get<string>('GRPC_OPTIMIZER_HOST', 'localhost')}:${configService.get<string>('GRPC_OPTIMIZER_PORT', '50051')}`,
          },
        }),
      },
    ]),
  ],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcClientModule {}
