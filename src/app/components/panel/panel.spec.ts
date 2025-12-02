import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Panel } from './panel';
import { PanelServices } from '../../services/panel-services';

describe('Panel', () => {
  let component: Panel;
  let fixture: ComponentFixture<Panel>;
  let mockPanelService: any;

  beforeEach(async () => {
    mockPanelService = {
      updatePages: vi.fn(),
      updateLanguages: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Panel],
      providers: [
        { provide: PanelServices, useValue: mockPanelService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Panel);
    component = fixture.componentInstance;
  });

  it('should create the component with correct initial values', () => {
    expect(component).toBeTruthy();
    expect(component.panelForm.get('pages')?.value).toBe(1);
    expect(component.panelForm.get('languages')?.value).toBe(1);
  });

  it('should increment and decrement pages correctly', () => {
    component.incrementPages();
    expect(component.pagesControl.value).toBe(2);

    component.decrementPages();
    expect(component.pagesControl.value).toBe(1);
  });

  it('should respect the minimum and maximum limits', () => {
    component.decrementPages();
    expect(component.pagesControl.value).toBe(1);

    component.panelForm.patchValue({ pages: 100 });
    component.incrementPages();
    expect(component.pagesControl.value).toBe(100);
  });

  it('should be update the service when valid values ​​change', () => {
    vi.clearAllMocks();

    component.panelForm.patchValue({ pages: 5, languages: 3 });

    expect(mockPanelService.updatePages).toHaveBeenCalledWith(5);
    expect(mockPanelService.updateLanguages).toHaveBeenCalledWith(3);
  });

  it('should NOT update the service with invalid values', () => {
    vi.clearAllMocks();

    // Valores fuera de rango
    component.panelForm.patchValue({ pages: 150, languages: -1 });

    expect(component.panelForm.valid).toBe(false);
    expect(mockPanelService.updatePages).not.toHaveBeenCalled();
    expect(mockPanelService.updateLanguages).not.toHaveBeenCalled();
  });
});
