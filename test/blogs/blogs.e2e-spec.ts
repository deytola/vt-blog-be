import * as faker from 'faker';
import * as request from 'supertest';
import { app } from '../setup.e2e';
import { User } from '../../src/users/entities/user.entity';

describe('BlogsController (e2e)', () => {
  let title: string;
  let content: string;
  let image: string;
  let category: string;
  let slug: string;

  it('should create a blog', async () => {
    title = faker.lorem.words(3);
    content = faker.lorem.sentences(10);
    image = faker.image.image(500, 500, true);
    category = 'Adventure';
    const author: User = new User();
    author.id = 1;
    author.firstName = faker.name.firstName();
    author.lastName = faker.name.lastName();
    author.email = faker.internet.email();

    const response = await request(app.getHttpServer()).post('/blogs/').send({
      title,
      content,
      image,
      category,
    });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    slug = response.body.blog.slug;
    expect(response.body.blog.title).toEqual(title);
    expect(response.body.blog.content).toEqual(content);
    expect(response.body.blog.image).toEqual(image);
    expect(response.body.blog.category).toEqual(category);
  });

  it('should fetch a blog by slug', async () => {
    const response = await request(app.getHttpServer()).get(`/blogs/${slug}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.blog.title).toEqual(title);
    expect(response.body.blog.content).toEqual(content);
    expect(response.body.blog.image).toEqual(image);
    expect(response.body.blog.category).toEqual(category);
  });

  it('should update a blog by slug', async () => {
    const updatePayload = {
      title: 'updated payload',
      content: 'updated content',
      image: faker.image.image(500, 500, true),
      category: 'General',
    };
    const response = await request(app.getHttpServer())
      .patch(`/blogs/${slug}`)
      .send(updatePayload);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.blog.title).toEqual(updatePayload.title);
    expect(response.body.blog.content).toEqual(updatePayload.content);
    expect(response.body.blog.image).toEqual(updatePayload.image);
    expect(response.body.blog.category).toEqual(updatePayload.category);
  });

  it('should publish a blog by slug', async () => {
    const response = await request(app.getHttpServer()).get(
      `/blogs/publish/${slug}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Blog published successfully');
  });

  it('should delete a blog by slug', async () => {
    const response = await request(app.getHttpServer()).delete(
      `/blogs/${slug}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Blog deleted successfully');
  });

  it('should fetch paginated blogs limited to 6 blogs per page', async () => {
    const response = await request(app.getHttpServer()).get('/blogs');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.blogs).toBeDefined();
    expect(response.body.blogs).toHaveLength(6);
    expect(response.body.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('should fetch a secure url for image upload', async () => {
    const response = await request(app.getHttpServer())
      .post('/blogs/upload_url')
      .send({
        content_type: 'image/png',
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.url).toBeDefined();
    expect(response.body.fields).toBeDefined();
    expect(response.body.fields.bucket).toBeDefined();
    expect(response.body.fields.key).toBeDefined();
    expect(response.body.fields.Policy).toBeDefined();
    expect(response.body.fields['X-Amz-Algorithm']).toBeDefined();
    expect(response.body.fields['X-Amz-Credential']).toBeDefined();
    expect(response.body.fields['X-Amz-Date']).toBeDefined();
    expect(response.body.fields['X-Amz-Signature']).toBeDefined();
  });
});
