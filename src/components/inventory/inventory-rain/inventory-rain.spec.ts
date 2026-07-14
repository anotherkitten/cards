import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRain } from './inventory-rain';

describe('InventoryRain', () => {
  let component: InventoryRain;
  let fixture: ComponentFixture<InventoryRain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryRain],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryRain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
