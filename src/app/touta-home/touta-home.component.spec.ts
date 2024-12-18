import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToutaHomeComponent } from './touta-home.component';

describe('ToutaHomeComponent', () => {
  let component: ToutaHomeComponent;
  let fixture: ComponentFixture<ToutaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToutaHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToutaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
