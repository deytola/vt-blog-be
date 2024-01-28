import * as faker from 'faker';
import * as request from 'supertest';
import { app } from '../setup.e2e';

describe('UserController (e2e)', () => {
  let firstName: string;
  let lastName: string;
  let email: string;
  let password: string;
  it('should create a user', async () => {
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    email = faker.internet.email();
    password = faker.internet.password();
    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        firstName,
        lastName,
        email,
        password,
      })
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.firstName).toEqual(firstName);
    expect(response.body.user.lastName).toEqual(lastName);
    expect(response.body.user.email).toEqual(email);
  });

  it('should login a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.lastLoginDate).toBeDefined();
    expect(response.body.user.firstName).toEqual(firstName);
    expect(response.body.user.lastName).toEqual(lastName);
    expect(response.body.user.email).toEqual(email);
  });
});
