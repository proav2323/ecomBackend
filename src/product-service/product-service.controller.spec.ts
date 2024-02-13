import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceController } from './product-service.controller';

describe('ProductServiceController', () => {
  let controller: ProductServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductServiceController],
    }).compile();

    controller = module.get<ProductServiceController>(ProductServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
