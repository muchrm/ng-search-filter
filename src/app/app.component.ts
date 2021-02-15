import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  debounceTime,
  map,
  take,
  switchMap,
} from 'rxjs/operators';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  searchTerm$ = new Subject<string>();
  categories$ = new BehaviorSubject<string[]>([]);
  filteredCategories$ = new BehaviorSubject<string[]>([]);

  constructor(
    private categoriesService: CategoriesService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.loadCategories();
      this.setFilter();
    });
  }

  loadCategories() {
    this.categoriesService
      .getCategories()
      .pipe(take(1))
      .subscribe((categories) => {
        this.zone.run(() => {
          this.categories$.next(categories);
          this.filteredCategories$.next(categories);
        });
      });
  }
  setFilter() {
    this.searchTerm$
      .pipe(debounceTime(500), this.filterCategories())
      .subscribe((filteredList) => {
        this.zone.run(() => {
          this.filteredCategories$.next(filteredList);
        });
      });
  }

  filterCategories() {
    return switchMap((term: string) =>
      this.categories$.pipe(
        map((list) => {
          return list.filter(
            (category) =>
              term == '' ||
              category.toLocaleLowerCase().includes(term.toLocaleLowerCase())
          );
        })
      )
    );
  }

  filter(searchTerm) {
    this.zone.runOutsideAngular(() => {
      this.searchTerm$.next(searchTerm);
    });
  }
}
