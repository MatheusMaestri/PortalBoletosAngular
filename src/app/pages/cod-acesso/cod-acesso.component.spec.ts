import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodAcessoComponent } from './cod-acesso.component';

describe('CodAcessoComponent', () => {
  let component: CodAcessoComponent;
  let fixture: ComponentFixture<CodAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodAcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
