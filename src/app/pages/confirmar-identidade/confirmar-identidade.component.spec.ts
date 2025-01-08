import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarIdentidadeComponent } from './confirmar-identidade.component';

describe('ConfirmarIdentidadeComponent', () => {
  let component: ConfirmarIdentidadeComponent;
  let fixture: ComponentFixture<ConfirmarIdentidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarIdentidadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarIdentidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
