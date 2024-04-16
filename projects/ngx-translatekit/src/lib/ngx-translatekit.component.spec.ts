import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTranslatekitComponent } from './ngx-translatekit.component';

describe('NgxTranslatekitComponent', () => {
  let component: NgxTranslatekitComponent;
  let fixture: ComponentFixture<NgxTranslatekitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTranslatekitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxTranslatekitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
