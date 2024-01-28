import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { MockAuthGuard } from './mocks/mock-auth.gaurd';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from '../src/authorization/guards/authorization.guard';

export let app: INestApplication;


beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(AuthorizationGuard)
    .useValue(new MockAuthGuard())
    .compile();
  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
});
