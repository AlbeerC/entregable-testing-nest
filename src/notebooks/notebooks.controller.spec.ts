import { Test, TestingModule } from '@nestjs/testing'
import { NotebooksController } from './notebooks.controller'
import { NotebooksService } from './notebooks.service'
import { Notebook } from './entities/notebook.entity'

describe('NotebooksController', () => {
  let controller: NotebooksController
  let service: NotebooksService

  const mockNotebook: Notebook = {
    id: 1,
    title: 'Nota 1',
    content: 'Contenido de nota 1',
  }

  const mockNotebooksService = {
    findAll: jest.fn().mockResolvedValue([mockNotebook]),
    create: jest.fn().mockImplementation(dto => Promise.resolve({ id: 2, ...dto })),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        { provide: NotebooksService, useValue: mockNotebooksService },
      ],
    }).compile()

    controller = module.get<NotebooksController>(NotebooksController)
    service = module.get<NotebooksService>(NotebooksService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return all notebooks', async () => {
    const result = await controller.findAll()
    expect(result).toEqual([mockNotebook])
    expect(service.findAll).toHaveBeenCalled()
  })

  it('should create a new notebook', async () => {
    const dto = { title: 'Nueva nota', content: 'Nuevo contenido' }
    const result = await controller.create(dto)
    expect(result).toEqual({ id: 2, ...dto })
    expect(service.create).toHaveBeenCalledWith(dto)
  })
})
