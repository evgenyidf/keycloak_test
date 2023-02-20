import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateKeycloakPolicyDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Policy to be used by all realms',
    example: 'length(8)',
  })
  readonly policy: string;
}
