import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewLoanPage } from './new-loan.page';

describe('NewLoanPage', () => {
  let component: NewLoanPage;
  let fixture: ComponentFixture<NewLoanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewLoanPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewLoanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
