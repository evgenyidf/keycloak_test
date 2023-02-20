import { Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';

interface AccessTokenData {
  token: string;
  expiresAt: number;
}

export class KeycloakAPI {
  private logger: Logger = new Logger(KeycloakAPI.name);
  private KeycloakBaseUrl =
    process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080/auth';
  private KeycloakUser = process.env.KEYCLOAK_USER || 'admin';
  private KeycloakPass = process.env.KEYCLOAK_PASSWORD || 'admin';
  private accessToken: AccessTokenData;

  /**
   * Runs HTTP request by using Axios library
   * @param {any} url:string
   * @param {any} method:Method
   * @param {any} options?:AxiosRequestConfig
   * @returns {response}
   */
  private async request(
    url: string,
    method: Method,
    options?: AxiosRequestConfig,
  ) {
    if (!this.accessToken?.token || this.accessToken?.expiresAt <= Date.now()) {
      await this.fetchToken().then();
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken.token}`,
      },
    };

    const res = axios(url, {
      ...{ method },
      ...options,
      ...defaultOptions,
    });

    return res;
  }

  /**
   * Get promise and return data from request
   * @param {any} promise:Promise<any>
   * @returns {any}
   */
  async returnRequestData(promise: Promise<any>) {
    const data = await promise
      .then((res) => {
        return res?.data;
      })
      .catch((e) => {
        throw new Error(e?.response?.data?.errorMessage);
      });

    return data;
  }

  /**
   * Fetch KeyCloak Authorization Token
   * and updated `accessToken` variable
   */
  private async fetchToken() {
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('client_id', 'admin-cli');
    params.set('username', this.KeycloakUser);
    params.set('password', this.KeycloakPass);

    await axios(
      `${this.KeycloakBaseUrl}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: params.toString(),
      },
    )
      .then((res) => {
        this.accessToken = {
          token: res.data.access_token,
          expiresAt: Date.now() + res.data.expires_in,
        };
      })
      .catch((e) => {
        this.logger.error(e.message);
        throw new Error(e.message);
      });
  }

  /**
   * Creates new realm by name
   * @param {any} name:string
   * @returns void
   */
  async createRealm(name: string): Promise<void> {
    const data = {
      id: name,
      realm: name,
    };

    const promise = this.request(
      `${this.KeycloakBaseUrl}/admin/realms`,
      'POST',
      { data },
    );

    const res = await this.returnRequestData(promise).catch((e) => {
      const message = `Keycloak realm '${name}' creation has failed: ${e.message}`;
      this.logger.error(message);
      throw new Error(message);
    });

    return res;
  }

  /**
   * Creates new realm by name
   * @param {any} name:string
   * @returns void
   */
  async listRealms(): Promise<any> {
    const promise = this.request(`${this.KeycloakBaseUrl}/admin/realms`, 'GET');

    const res = await this.returnRequestData(promise).catch((e) => {
      const message = `Keycloak realm '${name}' creation has failed: ${e.message}`;
      this.logger.error(message);
      throw new Error(message);
    });

    return res.map((realm) => realm.id);
  }

  async updatePolicy(realmName: string, policy: string): Promise<any> {
    const data = {
      id: realmName,
      realm: realmName,
      passwordPolicy: policy,
    };

    const promise = this.request(
      `${this.KeycloakBaseUrl}/admin/realms/${realmName}`,
      'PUT',
      { data },
    );

    const res = await this.returnRequestData(promise).catch((e) => {
      const message = `Realm '${realmName}' password policy update has failed: ${e.message}`;
      this.logger.error(message);
      throw new Error(message);
    });

    return res;
  }
}
