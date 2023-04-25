import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { CollaboratorsAdminController } from './collaborators-admin.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsService } from './collaborators.service';

const moduleMocker = new ModuleMocker(global);

enum Gender {
  MASCULINO = 'MASCULINO',
}

enum FrontBackSales {
  FRONT = 'FRONT',
  BACK = 'BACK',
  SALES = 'SALES',
}

enum ContractRegime {
  ASSOCIADO = 'ASSOCIADO',
}

describe('CollaboratorsController', () => {
  let collaboratorsController: CollaboratorsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsAdminController],
    })
      .useMocker((token) => {
        if (token === CollaboratorsService) {
          return {
            createCollaborator: jest.fn((data) => {
              return {
                data,
              };
            }),
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

    collaboratorsController = module.get<CollaboratorsAdminController>(
      CollaboratorsAdminController,
    );
  });

  it('should be able to create a new collaborator', async () => {
    const data = {
      collaborator: {
        id: '123456',
        surname: 'Doe',
        name: 'John',
        email: 'johndoe@email.com',
        advisor_code: '123456',
      },
      profile: {
        cpf: '123',
        role_id: '1234',
        av_entry_date: new Date(),
        bank_account: '123456',
        bank_agency: '123456',
        birth_date: new Date(),
        branch_id: '123456',
        gender: Gender.MASCULINO,
        f_b_s: FrontBackSales.SALES,
        collaborator_id: '123456',
        team_id: '123456',
        payment_bank: '123456',
        contract_regime: ContractRegime.ASSOCIADO,
        previous_company: 'Microsoft S/A',
        xp_entry_date: null,
        rg: '12345',
        av_departure_date: null,
      },
      address: {
        id: '12345',
        neighborhood: 'Itaim Bibi',
        location: 'SP',
        street: 'Juscelino',
        collaborator_id: '12345',
        number: 560,
        zip_code: '1234567',
        fu: 'SP',
        complement: null,
      },
      mea: {
        mea: false,
      },
    };

    expect(collaboratorsController.createCollaborator(data)).toHaveProperty(
      'data',
    );
  });
});
