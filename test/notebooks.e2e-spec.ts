import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('NotebooksController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should create a new notebook and get it', async () => {
    const dto = { title: 'Nota e2e', content: 'Contenido nota e2e' }

    // POST /notebooks
    const postResponse = await request(app.getHttpServer())
      .post('/notebooks')
      .send(dto)
      .expect(201)
    expect(postResponse.body).toMatchObject(dto)
    expect(postResponse.body.id).toBeDefined()

    // GET /notebooks
    const getResponse = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(200)
    expect(getResponse.body).toEqual(
      expect.arrayContaining([expect.objectContaining(dto)])
    )
  })
})