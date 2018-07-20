import { DraggaleModule } from './draggale.module';

describe('DraggaleModule', () => {
  let draggaleModule: DraggaleModule;

  beforeEach(() => {
    draggaleModule = new DraggaleModule();
  });

  it('should create an instance', () => {
    expect(draggaleModule).toBeTruthy();
  });
});
