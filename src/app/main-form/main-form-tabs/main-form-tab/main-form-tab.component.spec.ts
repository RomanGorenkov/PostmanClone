import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFormTabComponent } from './main-form-tab.component';

describe('MainFormTabComponent', () => {
  let component: MainFormTabComponent;
  let fixture: ComponentFixture<MainFormTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFormTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
