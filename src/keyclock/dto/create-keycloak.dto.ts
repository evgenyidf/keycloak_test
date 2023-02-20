import { ApiProperty } from '@nestjs/swagger';
import { IsFQDN, IsNotEmpty } from 'class-validator';

export class CreateKeycloakDto {
  @IsFQDN()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Realm name to be created',
    example: 'sub1.test.com',
  })
  readonly realm_name: string;
}
