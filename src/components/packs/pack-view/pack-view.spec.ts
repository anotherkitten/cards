import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackView } from './pack-view';

describe('PackView', () => {
  let component: PackView;
  let fixture: ComponentFixture<PackView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackView],
    }).compileComponents();

    fixture = TestBed.createComponent(PackView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
