import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Panel } from './panel';
import { PanelServices } from '../../services/panel-services';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('Panel', () => {
  let component: Panel;
  let fixture: ComponentFixture<Panel>;
  let mockPanelService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPanelService = {
      MAX_PAGES: 100,
      MAX_LANGUAGES: 50,       
      pages: signal(1),
      languages: signal(1),
      updatePages: vi.fn(),
      updateLanguages: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [Panel],
      providers: [
        { provide: PanelServices, useValue: mockPanelService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Panel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component with correct initial values', () => {
    expect(component).toBeTruthy();
    expect(component.panelForm.get('pages')?.value).toBe(1);
    expect(component.panelForm.get('languages')?.value).toBe(1);
  });

  it('should increment and decrement pages correctly', () => {
    component.increment('pages');
    expect(component.pagesControl.value).toBe(2);

    component.decrement('pages');
    expect(component.pagesControl.value).toBe(1);
  });

  it('should respect the minimum and maximum pages limits', () => {
    component.panelForm.patchValue({ pages: 1 });
    component.decrement('pages');
    expect(component.pagesControl.value).toBe(1);

    component.panelForm.patchValue({ pages: 100 });
    component.increment('pages');
    expect(component.pagesControl.value).toBe(100);
  });

  it('should respect the minimum and maximum languages limits', () => {
    component.panelForm.patchValue({ languages: 1 });
    component.decrement('languages');
    expect(component.languagesControl.value).toBe(1);

    component.panelForm.patchValue({ languages: 50 });
    component.increment('languages');
    expect(component.languagesControl.value).toBe(50);
  });

  it('should be update the service when valid values ​​change', () => {
    vi.clearAllMocks();

    component.panelForm.patchValue({ pages: 5, languages: 3 });

    expect(mockPanelService.updatePages).toHaveBeenCalledWith(5);
    expect(mockPanelService.updateLanguages).toHaveBeenCalledWith(3);
  });

  it('should NOT update the service with invalid values', () => {
    vi.clearAllMocks();

    component.panelForm.patchValue({ pages: 150, languages: -1 });

    expect(component.panelForm.valid).toBe(false);
    expect(mockPanelService.updatePages).not.toHaveBeenCalled();
    expect(mockPanelService.updateLanguages).not.toHaveBeenCalled();
  });
});
