import { CollaboratorsService } from './collaborators.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { CollaboratorsRepository } from './collaborators.repository';

const moduleMocker = new ModuleMocker(global);

const listCollaboratorsMocker = {
  collaborators: {
    id: '1',
    name: 'John',
    surname: 'Doe',
    email: 'johndoe@email.com',
    internal_code: 1,
    advisor_code: 'A1234',
    role: 'TI',
    av_entry_date: new Date(),
    branch: new Date(),
  },
  limit: 1,
  page: 10,
  total: 10,
};
describe('CollaboratorsService', () => {
  let collaboratorsService: CollaboratorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaboratorsService],
    })
      .useMocker((token) => {
        if (token === CollaboratorsRepository) {
          return {
            listCollaborators: jest
              .fn()
              .mockResolvedValue(listCollaboratorsMocker),
          };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    collaboratorsService =
      module.get<CollaboratorsService>(CollaboratorsService);
  });

  it('should be defined', () => {
    expect(collaboratorsService).toBeDefined();
  });

  it('should be able to list collaborators', async () => {
    const collaborators = await collaboratorsService.listCollaborators(1, 10);

    expect(collaborators).toEqual(listCollaboratorsMocker);
  });
});
