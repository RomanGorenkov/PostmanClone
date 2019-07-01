import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSidebarComponent } from './json-sidebar.component';

describe('JsonSidebarComponent', () => {
  let component: JsonSidebarComponent;
  let fixture: ComponentFixture<JsonSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
