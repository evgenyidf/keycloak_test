import {
  Controller,
  Post,
  Body,
  Get,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { CreateKeycloakDto } from './dto/create-keycloak.dto';
import { KeycloakService } from './keycloak.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateKeycloakPolicyDto } from './dto/update-keycloak-policy.dto';

@Controller('keycloak/realms')
@ApiTags('Keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @Post()
  createRealm(@Body() dto: CreateKeycloakDto) {
    return this.keycloakService.createRealm(dto);
  }

  @Get()
  listRealm() {
    return this.keycloakService.findAll();
  }

  @Post('policy')
  async updateRealmPolicy(@Body() dto: UpdateKeycloakPolicyDto) {
    const realms = await this.keycloakService.findAll();

    try {
      await Promise.all(
        realms.map(async (realm) => {
          await this.keycloakService.updatePolicy(realm, dto.policy);
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
