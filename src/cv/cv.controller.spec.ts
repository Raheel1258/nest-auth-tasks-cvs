import { Test, TestingModule } from '@nestjs/testing';
import { CVController } from './cv.controller';

describe('CvController', () => {
  let controller: CVController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CVController],
    }).compile();

    controller = module.get<CVController>(CVController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
