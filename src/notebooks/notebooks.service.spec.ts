import { Test, TestingModule } from '@nestjs/testing'
import { NotebooksService } from './notebooks.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Notebook } from './entities/notebook.entity'
import { Repository } from 'typeorm'

describe('NotebooksService', () => {
  let service: NotebooksService
  let repo: Repository<Notebook>

  const mockNotebook: Notebook = {
    id: 1,
    title: 'Nota 1',
    content: 'Contenido de nota 1',
  }

  const mockRepo = {
    find: jest.fn().mockResolvedValue([mockNotebook]),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue({ id: 2, title: 'Nueva nota', content: 'Nuevo contenido' }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        { provide: getRepositoryToken(Notebook), useValue: mockRepo },
      ],
    }).compile()

    service = module.get<NotebooksService>(NotebooksService)
    repo = module.get<Repository<Notebook>>(getRepositoryToken(Notebook))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('findAll should return all notebooks', async () => {
    const result = await service.findAll()
    expect(result).toEqual([mockNotebook])
    expect(repo.find).toHaveBeenCalledTimes(1)
  })

  it('create should add a new notebook', async () => {
    const dto = { title: 'Nueva nota', content: 'Nuevo contenido' }
    const result = await service.create(dto)
    expect(result).toEqual({ id: 2, title: 'Nueva nota', content: 'Nuevo contenido' })
    expect(repo.create).toHaveBeenCalledWith(dto)
    expect(repo.save).toHaveBeenCalledWith(dto)
  })
})