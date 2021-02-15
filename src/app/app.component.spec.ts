import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { AppComponent } from './app.component';
import { CategoriesService } from './categories.service';

describe('AppComponent', () => {
  const mockCategoriesService = {
    getCategories: () => of([]),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have a list of categories'`, fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(mockCategoriesService, 'getCategories').and.returnValue(
      of(['Animals', 'Anime', 'Anti-Malware', 'Art \u0026 Design'])
    );
    tick(500);
    fixture.detectChanges();
    const list = fixture.debugElement
      .queryAll(By.css('li'))
      .map((li) => (li.nativeElement as HTMLElement).innerText);
    expect(list).toEqual([
      'Animals',
      'Anime',
      'Anti-Malware',
      'Art \u0026 Design',
    ]);
  }));

  it(`should have a list of categories only filtered'`, fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(mockCategoriesService, 'getCategories').and.returnValue(
      of(['Animals', 'Anime', 'Anti-Malware', 'Art \u0026 Design'])
    );
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;
    input.value = 'ani';

    const evt = document.createEvent('KeyboardEvent');
    evt.initEvent('keyup', false, true);
    input.dispatchEvent(evt);

    tick(3000);
    fixture.detectChanges();
    const list = fixture.debugElement
      .queryAll(By.css('li'))
      .map((li) => (li.nativeElement as HTMLElement).innerText);
    app.filteredCategories$.subscribe(console.log);
    expect(list).toEqual(['Animals', 'Anime']);
  }));
});
