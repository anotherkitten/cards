import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryGlow } from './inventory-glow';

describe('InventoryGlow', () => {
  let component: InventoryGlow;
  let fixture: ComponentFixture<InventoryGlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryGlow],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryGlow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
