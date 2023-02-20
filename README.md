<p align="center">
  <a href="https://www.keycloak.org" target="blank"><img src="https://www.keycloak.org/resources/images/keycloak_logo_200px.svg" width="200" alt="Nest Logo" /></a>
</p>

# _KeyCloak Gateway_

## Description

KeyClock Rest API based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Main Project technologies

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [KeyCloak](https://www.keycloak.org)

### Main features

- KeyCloak data persistency based on `docker-compose` volumes
- Multiple Realm creation support
- Realm Password policy update

#### _Directory structure_

| Name                     | Description                         |
| ------------------------ | ----------------------------------- |
| [keycloak](src/keycloak) | keycloak module, including GW class |

## Running the app with docker-compose

```bash
# build docker image
$ docker build -t keycloak_mng:latest .

# run docker-compose
$ docker-compose up -d

# Open a browser to 'http://localhost:8088/api/docs/
$ open http://localhost:8088/api/docs/
```

## Debug installation

```bash
# Install JS packages
$ yarn install

# Run local server running on port 3000
$ yarn start:dev
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Stay in touch

- Author - [Evgeny Subotin](https://www.linkedin.com/in/subotinevgeny/)

## License

Nest is [MIT licensed](LICENSE).
