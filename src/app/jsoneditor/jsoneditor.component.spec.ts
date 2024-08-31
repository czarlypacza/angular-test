import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JSONeditorComponent } from './jsoneditor.component';

describe('JSONeditorComponent', () => {
  let component: JSONeditorComponent;
  let fixture: ComponentFixture<JSONeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JSONeditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JSONeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
