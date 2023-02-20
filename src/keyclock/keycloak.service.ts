import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateKeycloakDto } from './dto/create-keycloak.dto';
import { KeycloakAPI } from './keycloak-api';

@Injectable()
export class KeycloakService {
  private keycloak = new KeycloakAPI();

  async createRealm(dto: CreateKeycloakDto) {
    return await this.keycloak.createRealm(dto.realm_name).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  async findAll() {
    return await this.keycloak.listRealms().catch((e) => {
      throw new BadGatewayException(e.message);
    });
  }

  async updatePolicy(realmName: string, policy: string) {
    await this.keycloak.updatePolicy(realmName, policy);
  }
}
