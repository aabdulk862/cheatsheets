import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

/**
 * Chmura Economics & Analytics — Front-End Developer Interview Cheat Sheet
 * Product: JobsEQ — cloud-based labor market analytics (dashboards, charts, maps, tables, query forms)
 * Stack: Angular (modern), TypeScript, RxJS, Angular Material, SCSS, REST APIs, Vitest
 * Modern patterns: signals, signal forms, standalone components, inject(), control-flow (@if, @for, @switch)
 * Interview: Phone Screen → Skills Test → Panel (2-3 rounds, ~17 days, difficulty 2.67/5)
 */

export const chmuraConfig: CompanyConfig = {
  slug: 'chmura',
  title: 'Chmura Front-End Developer — Interview Cheat Sheet',
  subtitle:
    'Angular · TypeScript · RxJS · Signals · Angular Material · Data Visualization · JobsEQ Platform',
  accentColor: '#1B5E20',
  accentSecondary: '#4CAF50',
  timerMinutes: 60,
  tabs: [
    { id: 'angular', label: 'Angular/Signals' },
    { id: 'rxjs', label: 'RxJS/State' },
    { id: 'ui', label: 'Data UI Patterns' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
    { id: 'experience', label: 'My Experience' },
    { id: 'design', label: 'System Design' },
    { id: 'intro', label: 'Intro/Why' },
    { id: 'stories', label: 'Story Router' },
  ],
};

// ---------------------------------------------------------------------------
// Angular Modern Patterns (signals, standalone, control-flow, inject)
// ---------------------------------------------------------------------------

export const chmuraAngularPatterns: PatternSection[] = [
  {
    label: 'Signals & Reactive State',
    cards: [
      {
        title: 'Signal Basics — signal(), computed(), effect()',
        lang: 'typescript',
        description:
          'Signals are Chmura\'s preferred reactive primitive. Fine-grained reactivity without RxJS for synchronous state.',
        code: `import { signal, computed, effect } from '@angular/core';

// Writable signal
const count = signal(0);
count.set(5);
count.update(c => c + 1);

// Computed (derived, read-only, auto-tracked)
const doubled = computed(() => count() * 2);

// Effect (side effects when signals change)
effect(() => {
  console.log(\`Count is now: \${count()}\`);
  // Automatically tracks which signals are read
});

// In a component:
@Component({ ... })
export class DashboardComponent {
  selectedRegion = signal<string>('US');
  filters = signal<FilterState>({ year: 2024, industry: 'all' });

  stats = computed(() => {
    const region = this.selectedRegion();
    const f = this.filters();
    return this.dataService.getStats(region, f);
  });
}`,
        metaTags: ['signals', 'computed', 'effect', 'reactive state'],
      },
      {
        title: 'Signal Inputs & Outputs (Angular 17.1+)',
        lang: 'typescript',
        description:
          'Modern input/output API using signal-based inputs. Required and optional variants.',
        code: `import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-region-card',
  standalone: true,
  template: \`
    @if (region()) {
      <div class="region-card" (click)="selected.emit(region())">
        <h3>{{ region().name }}</h3>
        <span>{{ region().jobCount | number }} jobs</span>
      </div>
    }
  \`,
})
export class RegionCardComponent {
  // Required signal input
  region = input.required<Region>();

  // Optional with default
  highlighted = input(false);

  // Output (replaces @Output + EventEmitter)
  selected = output<Region>();
}`,
        metaTags: ['signal inputs', 'output', 'standalone', 'Angular 17+'],
      },
      {
        title: 'Signal Forms (Angular 18+)',
        lang: 'typescript',
        description:
          'Signal-based forms for complex query interfaces. Chmura builds query forms for labor market data filtering.',
        code: `import { signal, computed } from '@angular/core';

// Signal-based form state (no FormGroup needed for simple cases)
export class JobSearchFormComponent {
  // Form fields as signals
  keyword = signal('');
  region = signal<string | null>(null);
  industry = signal<string[]>([]);
  salaryMin = signal<number | null>(null);

  // Computed validity
  isValid = computed(() =>
    this.keyword().length > 0 || this.region() !== null
  );

  // Computed query params
  queryParams = computed(() => ({
    q: this.keyword(),
    region: this.region(),
    industries: this.industry(),
    salary_min: this.salaryMin(),
  }));

  onSubmit() {
    if (this.isValid()) {
      this.searchService.search(this.queryParams());
    }
  }

  reset() {
    this.keyword.set('');
    this.region.set(null);
    this.industry.set([]);
    this.salaryMin.set(null);
  }
}`,
        metaTags: ['signal forms', 'computed', 'query forms', 'validation'],
      },
    ],
  },
  {
    label: 'Standalone Components & Modern DI',
    cards: [
      {
        title: 'Standalone Component with inject()',
        lang: 'typescript',
        description:
          'Standalone components are the default. Use inject() instead of constructor injection.',
        code: `import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-occupation-table',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="title">
        <mat-header-cell *matHeaderCellDef>Occupation</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.title }}</mat-cell>
      </ng-container>
      <!-- more columns -->
    </mat-table>
    <mat-paginator [pageSizeOptions]="[10, 25, 50]" />
  \`,
})
export class OccupationTableComponent {
  // inject() instead of constructor DI
  private readonly occupationService = inject(OccupationService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  dataSource = new MatTableDataSource<Occupation>();

  ngOnInit() {
    this.occupationService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => this.dataSource.data = data);
  }
}`,
        metaTags: ['standalone', 'inject()', 'OnPush', 'Angular Material'],
      },
      {
        title: 'Control-Flow Syntax (@if, @for, @switch)',
        lang: 'typescript',
        description:
          'New built-in control flow replaces *ngIf, *ngFor. Better type narrowing and performance.',
        code: `@Component({
  standalone: true,
  template: \`
    @if (loading()) {
      <mat-spinner />
    } @else if (error()) {
      <app-error-banner [message]="error()" />
    } @else {
      <div class="dashboard-grid">
        @for (card of dashboardCards(); track card.id) {
          <app-stat-card
            [title]="card.title"
            [value]="card.value"
            [trend]="card.trend" />
        } @empty {
          <p>No data available for selected region.</p>
        }
      </div>

      @switch (viewMode()) {
        @case ('chart') { <app-chart [data]="chartData()" /> }
        @case ('table') { <app-data-table [data]="tableData()" /> }
        @case ('map')   { <app-region-map [data]="mapData()" /> }
      }
    }
  \`,
})
export class DashboardComponent {
  loading = signal(true);
  error = signal<string | null>(null);
  viewMode = signal<'chart' | 'table' | 'map'>('chart');
  dashboardCards = signal<StatCard[]>([]);
}`,
        metaTags: ['@if', '@for', '@switch', 'control flow', 'track'],
      },
    ],
  },
  {
    label: 'Component Architecture & Patterns',
    cards: [
      {
        title: 'Smart/Dumb Component Pattern',
        lang: 'typescript',
        description:
          'Container (smart) components handle state/logic. Presentational (dumb) components handle UI only.',
        code: `// Smart container — owns state, calls services
@Component({
  selector: 'app-industry-dashboard',
  standalone: true,
  imports: [IndustryChartComponent, IndustryFiltersComponent],
  template: \`
    <app-industry-filters
      [regions]="regions()"
      (filtersChanged)="onFiltersChanged($event)" />
    <app-industry-chart
      [data]="chartData()"
      [loading]="loading()" />
  \`,
})
export class IndustryDashboardContainer {
  private dataService = inject(IndustryDataService);

  regions = signal<Region[]>([]);
  chartData = signal<ChartPoint[]>([]);
  loading = signal(false);

  onFiltersChanged(filters: IndustryFilters) {
    this.loading.set(true);
    this.dataService.query(filters).subscribe(data => {
      this.chartData.set(data);
      this.loading.set(false);
    });
  }
}

// Dumb presentational — pure inputs/outputs, no services
@Component({
  selector: 'app-industry-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @if (loading()) { <mat-spinner /> }
    @else { <canvas #chart></canvas> }
  \`,
})
export class IndustryChartComponent {
  data = input.required<ChartPoint[]>();
  loading = input(false);
}`,
        metaTags: ['smart/dumb', 'container', 'presentational', 'architecture'],
      },
    ],
  },
  {
    label: 'Testing with Vitest',
    cards: [
      {
        title: 'Component Testing with Vitest + TestBed',
        lang: 'typescript',
        description:
          'Chmura uses Vitest. Behavior-focused tests: render component, interact, assert output.',
        code: `import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { RegionFilterComponent } from './region-filter.component';

describe('RegionFilterComponent', () => {
  it('emits selected region on click', async () => {
    const onSelect = vi.fn();
    await render(RegionFilterComponent, {
      inputs: {
        regions: [
          { id: '1', name: 'Cleveland' },
          { id: '2', name: 'Richmond' },
        ],
      },
      on: { regionSelected: onSelect },
    });

    const button = screen.getByText('Cleveland');
    fireEvent.click(button);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Cleveland' })
    );
  });

  it('shows empty state when no regions', async () => {
    await render(RegionFilterComponent, {
      inputs: { regions: [] },
    });

    expect(screen.getByText('No regions available')).toBeTruthy();
  });
});`,
        metaTags: ['Vitest', 'TestBed', 'testing-library', 'behavior testing'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// RxJS & State Management Patterns
// ---------------------------------------------------------------------------

export const chmuraRxjsPatterns: PatternSection[] = [
  {
    label: 'RxJS Operators for Data Fetching',
    cards: [
      {
        title: 'switchMap for Search/Filter APIs',
        lang: 'typescript',
        description:
          'Cancel previous request when new filter applied. Critical for JobsEQ search-as-you-type.',
        code: `import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

@Component({ ... })
export class JobSearchComponent {
  private searchTerms = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  results = signal<Job[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading.set(true)),
      switchMap(term =>
        this.jobService.search(term).pipe(
          catchError(err => {
            console.error('Search failed:', err);
            return of([]);
          })
        )
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(jobs => {
      this.results.set(jobs);
      this.loading.set(false);
    });
  }

  onSearch(term: string) {
    this.searchTerms.next(term);
  }
}`,
        metaTags: ['switchMap', 'debounce', 'search', 'cancellation'],
      },
      {
        title: 'combineLatest for Multi-Filter Dashboards',
        lang: 'typescript',
        description:
          'Combine multiple filter signals/observables. Re-fetch when any filter changes.',
        code: `import { combineLatest, startWith, switchMap } from 'rxjs';

export class DashboardService {
  private region$ = new BehaviorSubject<string>('US');
  private year$ = new BehaviorSubject<number>(2024);
  private industry$ = new BehaviorSubject<string>('all');

  // Re-fetch whenever ANY filter changes
  dashboardData$ = combineLatest([
    this.region$,
    this.year$,
    this.industry$,
  ]).pipe(
    switchMap(([region, year, industry]) =>
      this.http.get<DashboardData>('/api/dashboard', {
        params: { region, year: year.toString(), industry }
      })
    ),
    shareReplay(1),
  );

  setRegion(region: string) { this.region$.next(region); }
  setYear(year: number) { this.year$.next(year); }
  setIndustry(industry: string) { this.industry$.next(industry); }
}`,
        metaTags: ['combineLatest', 'BehaviorSubject', 'multi-filter', 'dashboard'],
      },
    ],
  },
  {
    label: 'RxJS Error Handling & Retry',
    cards: [
      {
        title: 'Retry with Exponential Backoff',
        lang: 'typescript',
        description:
          'Resilient API calls with retry logic for flaky network conditions.',
        code: `import { retry, timer, catchError } from 'rxjs';

export class ApiService {
  private http = inject(HttpClient);

  fetchWithRetry<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.warn(\`Retry \${retryCount} in \${delayMs}ms\`);
          return timer(delayMs);
        },
        resetOnSuccess: true,
      }),
      catchError(err => {
        // Final fallback after all retries exhausted
        this.notificationService.showError('Failed to load data');
        return throwError(() => err);
      }),
    );
  }
}`,
        metaTags: ['retry', 'backoff', 'error handling', 'resilience'],
      },
    ],
  },
  {
    label: 'State Management Patterns',
    cards: [
      {
        title: 'Signal Store Pattern (Lightweight)',
        lang: 'typescript',
        description:
          'Component-level or feature-level state with signals. No NgRx needed for most cases at Chmura scale.',
        code: `import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegionStore {
  // State
  private readonly _regions = signal<Region[]>([]);
  private readonly _selectedId = signal<string | null>(null);
  private readonly _loading = signal(false);

  // Selectors (computed)
  readonly regions = this._regions.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly selected = computed(() => {
    const id = this._selectedId();
    return this._regions().find(r => r.id === id) ?? null;
  });

  // Actions
  private dataService = inject(RegionDataService);

  loadRegions() {
    this._loading.set(true);
    this.dataService.getAll().subscribe({
      next: regions => {
        this._regions.set(regions);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  select(id: string) { this._selectedId.set(id); }
}`,
        metaTags: ['signal store', 'state management', 'computed', 'injectable'],
      },
      {
        title: 'takeUntilDestroyed — Memory Leak Prevention',
        lang: 'typescript',
        description:
          'Modern alternative to takeUntil(destroy$). Automatically unsubscribes on component destroy.',
        code: `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

@Component({ ... })
export class LiveDataComponent {
  private destroyRef = inject(DestroyRef);
  private ws = inject(WebSocketService);

  ngOnInit() {
    // Auto-unsubscribes when component is destroyed
    this.ws.messages$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(msg => this.handleMessage(msg));
  }
}

// Also works in inject context (constructor/field initializer):
@Component({ ... })
export class AlternativeComponent {
  // Called at construction time — no DestroyRef needed
  data$ = inject(DataService).stream$.pipe(
    takeUntilDestroyed()
  );
}`,
        metaTags: ['takeUntilDestroyed', 'memory leak', 'DestroyRef', 'cleanup'],
      },
    ],
  },
  {
    label: 'HTTP & REST API Integration',
    cards: [
      {
        title: 'Typed HTTP Service with Interceptors',
        lang: 'typescript',
        description:
          'Strongly typed API service pattern. Chmura consumes REST APIs for labor market data.',
        code: `interface OccupationResponse {
  data: Occupation[];
  total: number;
  page: number;
}

@Injectable({ providedIn: 'root' })
export class OccupationApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1/occupations';

  getAll(params: OccupationQuery): Observable<OccupationResponse> {
    return this.http.get<OccupationResponse>(this.baseUrl, {
      params: {
        region: params.region,
        page: params.page.toString(),
        size: params.size.toString(),
        sort: params.sort ?? 'employment_desc',
      },
    });
  }

  getById(id: string): Observable<Occupation> {
    return this.http.get<Occupation>(\`\${this.baseUrl}/\${id}\`);
  }

  getTimeSeries(id: string, years: number): Observable<TimeSeriesPoint[]> {
    return this.http.get<TimeSeriesPoint[]>(
      \`\${this.baseUrl}/\${id}/timeseries\`,
      { params: { years: years.toString() } }
    );
  }
}`,
        metaTags: ['HttpClient', 'REST API', 'typed', 'service'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Data UI Patterns (charts, tables, maps, dashboards)
// ---------------------------------------------------------------------------

export const chmuraUiPatterns: PatternSection[] = [
  {
    label: 'Data Tables (Angular Material)',
    cards: [
      {
        title: 'Sortable, Paginated, Filterable Data Table',
        lang: 'typescript',
        description:
          'JobsEQ has data-heavy tables. Mat-table with server-side pagination, sorting, and filtering.',
        code: `@Component({
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  template: \`
    <mat-form-field>
      <input matInput (input)="applyFilter($event)" placeholder="Filter">
    </mat-form-field>

    <mat-table [dataSource]="dataSource" matSort
               (matSortChange)="onSortChange($event)">

      <ng-container matColumnDef="occupation">
        <mat-header-cell *matHeaderCellDef mat-sort-header>
          Occupation
        </mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.title }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="employment">
        <mat-header-cell *matHeaderCellDef mat-sort-header>
          Employment
        </mat-header-cell>
        <mat-cell *matCellDef="let row">
          {{ row.employment | number }}
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns" />
      <mat-row *matRowDef="let row; columns: displayedColumns" />
    </mat-table>

    <mat-paginator [length]="totalResults()"
                   [pageSize]="25"
                   [pageSizeOptions]="[10, 25, 50, 100]"
                   (page)="onPageChange($event)" />
  \`,
})
export class OccupationTableComponent {
  displayedColumns = ['occupation', 'employment', 'wages', 'growth'];
  totalResults = signal(0);
  dataSource = new MatTableDataSource<Occupation>();
}`,
        metaTags: ['mat-table', 'pagination', 'sorting', 'filtering'],
      },
    ],
  },
  {
    label: 'Charts & Data Visualization',
    cards: [
      {
        title: 'Chart Component with Signal-Based Data',
        lang: 'typescript',
        description:
          'Wrapping a chart library (Chart.js / D3) in an Angular component with signal inputs.',
        code: `@Component({
  selector: 'app-trend-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<canvas #chartCanvas></canvas>\`,
})
export class TrendChartComponent implements AfterViewInit {
  data = input.required<TimeSeriesPoint[]>();
  chartType = input<'line' | 'bar'>('line');

  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  constructor() {
    // React to data changes via effect
    effect(() => {
      const data = this.data();
      if (this.chart) {
        this.chart.data.labels = data.map(d => d.year.toString());
        this.chart.data.datasets[0].data = data.map(d => d.value);
        this.chart.update();
      }
    });
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.chartType(),
      data: {
        labels: this.data().map(d => d.year.toString()),
        datasets: [{
          label: 'Employment',
          data: this.data().map(d => d.value),
          borderColor: '#1B5E20',
        }],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
}`,
        metaTags: ['Chart.js', 'canvas', 'signal effect', 'data visualization'],
      },
    ],
  },
  {
    label: 'Maps & Geospatial',
    cards: [
      {
        title: 'Interactive Map Component',
        lang: 'typescript',
        description:
          'Geospatial views for labor market data. Leaflet/Mapbox wrapper with region selection.',
        code: `@Component({
  selector: 'app-region-map',
  standalone: true,
  template: \`<div #mapContainer class="map-container"></div>\`,
  styles: \`.map-container { height: 400px; width: 100%; }\`,
})
export class RegionMapComponent implements AfterViewInit, OnDestroy {
  regions = input.required<GeoRegion[]>();
  regionSelected = output<string>();

  @ViewChild('mapContainer') mapEl!: ElementRef;
  private map!: L.Map;
  private geoLayer!: L.GeoJSON;

  ngAfterViewInit() {
    this.map = L.map(this.mapEl.nativeElement).setView([39.5, -98.35], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.geoLayer = L.geoJSON(undefined, {
      style: feature => ({
        fillColor: this.getColor(feature?.properties?.value),
        weight: 1, fillOpacity: 0.7,
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', () =>
          this.regionSelected.emit(feature.properties.id));
        layer.bindTooltip(feature.properties.name);
      },
    }).addTo(this.map);
  }

  private getColor(value: number): string {
    return value > 1000 ? '#1B5E20' : value > 500 ? '#4CAF50' : '#C8E6C9';
  }

  ngOnDestroy() { this.map?.remove(); }
}`,
        metaTags: ['Leaflet', 'map', 'GeoJSON', 'choropleth'],
      },
    ],
  },
  {
    label: 'Forms & Filters (Angular Material)',
    cards: [
      {
        title: 'Complex Query Form with Reactive Forms',
        lang: 'typescript',
        description:
          'Multi-field filter form for data exploration. Autocomplete, selects, date ranges.',
        code: `@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    MatAutocompleteModule, MatDatepickerModule,
  ],
  template: \`
    <form [formGroup]="form" (ngSubmit)="search()">
      <mat-form-field>
        <mat-label>Region</mat-label>
        <input matInput formControlName="region"
               [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete">
          @for (option of filteredRegions(); track option.id) {
            <mat-option [value]="option.name">{{ option.name }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Industry</mat-label>
        <mat-select formControlName="industry" multiple>
          @for (ind of industries(); track ind.code) {
            <mat-option [value]="ind.code">{{ ind.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button mat-raised-button type="submit"
              [disabled]="form.invalid">Search</button>
    </form>
  \`,
})
export class QueryFormComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    region: ['', Validators.required],
    industry: [[] as string[]],
    yearRange: this.fb.group({
      start: [2020], end: [2024],
    }),
  });
}`,
        metaTags: ['reactive forms', 'autocomplete', 'mat-select', 'query form'],
      },
    ],
  },
  {
    label: 'Accessibility & Responsive Design',
    cards: [
      {
        title: 'Accessible Data Table with ARIA',
        lang: 'typescript',
        description:
          'Job posting mentions accessible code. Proper ARIA roles, keyboard navigation, screen reader support.',
        code: `// Accessibility checklist for Chmura data interfaces:
// 1. All interactive elements keyboard-accessible (tabindex, Enter/Space)
// 2. ARIA labels on custom controls
// 3. Live regions for dynamic content updates
// 4. Sufficient color contrast (WCAG 2.1 AA)
// 5. Focus management on route changes

@Component({
  template: \`
    <table role="grid" aria-label="Occupation data for selected region"
           [attr.aria-busy]="loading()">
      <caption class="sr-only">
        Showing {{ data().length }} occupations for {{ region() }}
      </caption>
      <thead>
        <tr>
          <th scope="col" [attr.aria-sort]="getSortDirection('title')">
            <button (click)="sort('title')">Occupation</button>
          </th>
        </tr>
      </thead>
    </table>

    <!-- Live region for filter updates -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ data().length }} results found
    </div>
  \`,
  styles: \`.sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); border: 0;
  }\`,
})
export class AccessibleTableComponent { }`,
        metaTags: ['a11y', 'ARIA', 'keyboard nav', 'WCAG'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Likely Questions
// ---------------------------------------------------------------------------

export const chmuraQuestions: QuestionItem[] = [
  {
    name: 'Explain Angular signals vs RxJS Observables — when to use each',
    diff: 'medium',
    hint: 'Signals = synchronous state, auto-tracking, simpler. Observables = async streams, operators, complex flows.',
    lang: 'typescript',
    code: `// Signals: synchronous, fine-grained, auto-tracked
// USE FOR: component state, form values, UI flags, computed derived state
const count = signal(0);
const doubled = computed(() => count() * 2);

// Observables: asynchronous, push-based, rich operators
// USE FOR: HTTP requests, WebSockets, event streams, complex async coordination
searchResults$ = this.searchTerms$.pipe(
  debounceTime(300),
  switchMap(term => this.api.search(term))
);

// In Chmura's codebase you'd likely see BOTH:
// - Signals for local component state and simple cross-component state
// - RxJS for HTTP calls, real-time data, multi-filter coordination
// - toSignal() / toObservable() bridges when needed

import { toSignal, toObservable } from '@angular/core/rxjs-interop';
const results = toSignal(this.searchResults$, { initialValue: [] });`,
  },
  {
    name: 'How would you build a filterable, paginated data table?',
    diff: 'medium',
    hint: 'Server-side pagination, debounced filter, loading states, empty/error states, sort headers.',
    lang: 'typescript',
    code: `// Key decisions for Chmura's data tables:
// 1. Server-side pagination (datasets too large for client-side)
// 2. Debounced text filter (300ms) to avoid excessive API calls
// 3. Column sorting via mat-sort with server-side sort params
// 4. Loading skeleton while fetching
// 5. Empty state / error state handling

onPageOrSortChange() {
  const params = {
    page: this.paginator.pageIndex,
    size: this.paginator.pageSize,
    sort: this.sort.active,
    direction: this.sort.direction,
    filter: this.filterValue(),
  };
  this.loading.set(true);
  this.apiService.query(params).subscribe({
    next: res => {
      this.dataSource.data = res.data;
      this.totalResults.set(res.total);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('Failed to load data');
      this.loading.set(false);
    },
  });
}`,
  },
  {
    name: 'Describe your approach to modernizing legacy AngularJS code',
    diff: 'medium',
    hint: 'Incremental migration, ngUpgrade, standalone components, feature flags, test coverage first.',
    lang: 'typescript',
    code: `// Chmura still has AngularJS areas being modernized:
//
// Migration strategy:
// 1. Add test coverage to legacy code BEFORE migrating
// 2. Use ngUpgrade to bootstrap hybrid app (AngularJS + Angular)
// 3. Migrate bottom-up: shared services → pipes → components
// 4. Convert to standalone components (no NgModule needed)
// 5. Replace $scope with signals, $http with HttpClient
// 6. Replace ng-repeat with @for, ng-if with @if
// 7. Replace AngularJS services with @Injectable + inject()
//
// Key principles:
// - Small PRs, incremental progress
// - Feature flags to toggle new vs old
// - Maintain backward compatibility during transition
// - Remove AngularJS dependencies module by module`,
  },
  {
    name: 'How do you handle complex data visualization in Angular?',
    diff: 'hard',
    hint: 'Chart wrapper components, OnPush + signals for perf, resize observers, accessible alternatives.',
    lang: 'typescript',
    code: `// Chmura builds: charts, maps, dashboards, complex tables
//
// Architecture for chart components:
// 1. Wrapper component with signal inputs for data + options
// 2. effect() to update chart when data changes (not full re-render)
// 3. OnPush change detection (chart library handles its own DOM)
// 4. ResizeObserver for responsive charts
// 5. Accessible: provide alt text, data table fallback

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWrapperComponent {
  data = input.required<DataPoint[]>();

  private resizeObserver = new ResizeObserver(() => this.chart?.resize());

  constructor() {
    effect(() => {
      const newData = this.data();
      // Update only the data, not the entire chart instance
      this.chart.setOption({ series: [{ data: newData }] });
    });
  }

  ngAfterViewInit() {
    this.resizeObserver.observe(this.chartEl.nativeElement);
  }

  ngOnDestroy() { this.resizeObserver.disconnect(); }
}`,
  },
  {
    name: 'What is your approach to testing Angular components?',
    diff: 'medium',
    hint: 'Behavior-focused tests, Testing Library, mock services, test inputs/outputs, avoid implementation details.',
    lang: 'typescript',
    code: `// Chmura uses Vitest + Angular Testing Library
// Focus on BEHAVIOR not implementation:

// ✅ Good: test what user sees/does
it('shows occupation count when region is selected', async () => {
  const { fixture } = await render(DashboardComponent, {
    providers: [
      { provide: DataService, useValue: mockDataService }
    ],
  });
  const select = screen.getByRole('combobox', { name: /region/i });
  await userEvent.selectOptions(select, 'Cleveland');

  expect(await screen.findByText('1,234 occupations')).toBeTruthy();
});

// ❌ Bad: testing implementation details
it('calls service with correct params', () => { ... });

// Test patterns for Chmura:
// - Render component with inputs → assert rendered output
// - Simulate user interactions → assert side effects
// - Mock HTTP responses → assert loading/error/success states
// - Test accessibility: screen.getByRole(), toBeAccessible()`,
  },
  {
    name: 'How do you ensure performance in data-heavy Angular apps?',
    diff: 'hard',
    hint: 'OnPush, signals, trackBy/@for track, virtual scroll, lazy loading, web workers for parsing.',
    lang: 'typescript',
    code: `// Performance strategies for JobsEQ-scale data:
//
// 1. OnPush change detection everywhere
// 2. Signals (fine-grained updates, no zone.js overhead)
// 3. @for with track expression (efficient DOM diffing)
@for (row of rows(); track row.id) { ... }

// 4. Virtual scrolling for large lists
import { ScrollingModule } from '@angular/cdk/scrolling';
// <cdk-virtual-scroll-viewport itemSize="48">
//   <div *cdkVirtualFor="let item of items">{{ item.name }}</div>
// </cdk-virtual-scroll-viewport>

// 5. Lazy load routes and heavy components
export const routes: Routes = [
  { path: 'map', loadComponent: () =>
    import('./map/map.component').then(m => m.MapComponent) },
];

// 6. Debounce expensive computations
// 7. Web Workers for large data parsing
// 8. Use trackBy in remaining *ngFor directives
// 9. Avoid unnecessary template bindings in loops
// 10. Pagination (server-side) over loading all data`,
  },
  {
    name: 'Tell me about a time you improved an existing codebase',
    diff: 'easy',
    hint: 'STAR format. Focus on technical debt reduction, incremental improvement, measurable impact.',
    lang: 'bash',
    code: `# STAR Framework — Key for Chmura behavioral questions:
#
# Situation: Large Angular app with mixed legacy patterns
# Task: Reduce bundle size and improve load time
# Action:
#   - Audited with webpack-bundle-analyzer
#   - Converted 12 modules to standalone components
#   - Lazy-loaded 3 feature routes
#   - Replaced moment.js with date-fns (tree-shakeable)
#   - Added OnPush to 40+ components
# Result:
#   - 35% smaller initial bundle
#   - 2s faster first meaningful paint
#   - Documented patterns for team to follow
#
# Chmura values: trust, curiosity, steady follow-through
# Show: incremental improvement, not big-bang rewrites`,
  },
  {
    name: 'How do you approach accessibility in data-rich interfaces?',
    diff: 'medium',
    hint: 'ARIA roles, keyboard nav, color contrast, screen reader testing, data table alternatives.',
    lang: 'typescript',
    code: `// Chmura job posting specifically mentions "accessible code"
//
// Key practices for data-heavy UIs:
// 1. Semantic HTML first (table, th[scope], caption)
// 2. ARIA for custom widgets (role="grid", aria-sort, aria-live)
// 3. Keyboard navigation for all interactive elements
// 4. Color contrast ≥ 4.5:1 (WCAG AA)
// 5. Charts: provide data table fallback or aria-label summary
// 6. Focus management on dynamic content updates
// 7. aria-live="polite" for filter result counts
// 8. Skip links for complex layouts

// Angular Material helps:
// - mat-table has built-in ARIA roles
// - mat-sort-header announces sort state
// - mat-paginator has aria labels
// - Focus indicators are built in

// Testing: use axe-core in unit/e2e tests
import { axe } from 'jest-axe';
it('has no a11y violations', async () => {
  const results = await axe(fixture.nativeElement);
  expect(results.violations).toHaveLength(0);
});`,
  },
  {
    name: 'Describe how you use AI-assisted development tools',
    diff: 'easy',
    hint: 'Chmura explicitly uses AI tools. Show: generate, refactor, test, validate, own the code.',
    lang: 'bash',
    code: `# From job posting: "extensive use of AI-assisted development tools
# to help generate, refactor, test, document, and debug code"
#
# Key: "understand, validate, improve, and take ownership"
#
# How I use AI tools in Angular development:
# 1. Generate: boilerplate components, service skeletons, test stubs
# 2. Refactor: migrate *ngIf to @if, extract shared components
# 3. Test: generate Vitest specs, edge cases, accessibility tests
# 4. Document: generate JSDoc, component usage examples
# 5. Debug: explain error messages, suggest fixes
#
# Critical principles (match Chmura values):
# - Review ALL generated code for correctness
# - Validate against team patterns and conventions
# - Check accessibility compliance
# - Ensure maintainability (not just "works")
# - Take full ownership — if it ships, it is YOUR code`,
  },
  {
    name: 'How would you structure a shared component library?',
    diff: 'medium',
    hint: 'Chmura mentions shared UI components. Standalone, documented, tested, input/output contracts.',
    lang: 'typescript',
    code: `// Shared UI component library structure for Chmura:
// libs/ui/
// ├── stat-card/         (dashboard stat cards)
// ├── data-table/        (configurable table wrapper)
// ├── chart-wrapper/     (Chart.js/D3 wrapper)
// ├── region-select/     (autocomplete region picker)
// ├── filter-panel/      (reusable filter container)
// └── empty-state/       (consistent empty/error states)

// Each shared component:
@Component({
  selector: 'ui-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <mat-card>
      <mat-card-header>
        <mat-icon [color]="trendColor()">{{ trendIcon() }}</mat-icon>
        <span>{{ title() }}</span>
      </mat-card-header>
      <mat-card-content>
        <span class="value">{{ value() | number }}</span>
        <span class="trend" [class.positive]="trend() > 0">
          {{ trend() | percent:'1.1-1' }}
        </span>
      </mat-card-content>
    </mat-card>
  \`,
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<number>();
  trend = input(0);  // percent change
  trendColor = computed(() => this.trend() >= 0 ? 'primary' : 'warn');
  trendIcon = computed(() => this.trend() >= 0 ? 'trending_up' : 'trending_down');
}`,
  },
];

// ---------------------------------------------------------------------------
// Game Plan
// ---------------------------------------------------------------------------

export const chmuraGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Phone Screen', type: 'Recruiter/HR', minutes: 30, highlight: false },
    { label: 'Skills Test', type: 'Technical Assessment', minutes: 60, highlight: true },
    { label: 'Panel Interview', type: 'Technical + Culture', minutes: 60, highlight: true },
    { label: 'Final Interview', type: 'Team Fit', minutes: 45, highlight: false },
  ],
  strategies: [
    {
      title: 'Phone Screen — Show Angular Depth',
      steps: [
        'Lead with 3+ years of Angular + TypeScript experience',
        'Mention specific modern patterns: signals, standalone, control-flow',
        'Reference data-heavy UI experience (tables, charts, dashboards)',
        'Show interest in JobsEQ product and labor market data domain',
        'Ask about the team Kanban workflow and modernization work',
      ],
      highlightText: 'Difficulty 2.67/5 — focus on fit, not trick questions',
    },
    {
      title: 'Skills Test — Likely Angular Coding Task',
      steps: [
        'Glassdoor: 17% of interviews include a skills test',
        'Expect: build/modify an Angular component (standalone, signals)',
        'Show: proper typing, OnPush, accessibility, clean structure',
        'Use modern syntax: @if/@for, inject(), signal inputs/outputs',
        'Include a test (Vitest) if time allows',
        'Attention to detail matters (Glassdoor: "case interview, attention to detail")',
      ],
      highlightText: 'They look for thoughtful, maintainable code — not speed',
    },
    {
      title: 'Panel Interview — Technical + Culture',
      steps: [
        'Expect questions about RxJS, signals, component architecture',
        'Be ready to discuss modernizing legacy code (AngularJS → Angular)',
        'Know data visualization: chart libs, responsive tables, maps',
        'Discuss testing philosophy (behavior-focused, Vitest, TestBed)',
        'Prepare: "How do you approach accessibility in complex UIs?"',
        'Show: collaborative communication, curiosity, willingness to learn',
      ],
    },
    {
      title: 'Culture Fit — Match Chmura Values',
      steps: [
        'Values: trust, respect, curiosity, steady follow-through',
        'Small company — show you can wear multiple hats',
        'Collaborative UI team — emphasize communication and code reviews',
        'AI tools: show you use them thoughtfully (validate, own the code)',
        'Ask about: product workflows, team communication, Kanban board',
        'Show genuine interest in labor market data and the domain',
      ],
      highlightText: 'Small collaborative team — culture fit is critical',
    },
  ],
  keywords: [
    'Angular',
    'TypeScript',
    'RxJS',
    'signals',
    'standalone components',
    'inject()',
    'control-flow syntax',
    'Angular Material',
    'SCSS',
    'Vitest',
    'REST APIs',
    'data visualization',
    'charts',
    'maps',
    'tables',
    'dashboards',
    'accessibility',
    'Kanban',
    'AI-assisted development',
    'AngularJS migration',
  ],
};
