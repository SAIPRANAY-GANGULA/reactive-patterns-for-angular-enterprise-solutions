import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PagerComponent } from './pager/pager.component';
import { PaginationOnSignalsComponent } from './pagination-on-signals/pagination-on-signals.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-pager
      [itemsPerPage]="itemsPerPage$$ | async"
      [total]="total$$ | async"
      [pageIndex]="pageIndex$$ | async"
      (pageIndexChange)="pageIndex$$.next($event)"
    ></app-pager>

    <br />
    <br />
    <br />

    <app-pagination-on-signals
      [total]="total"
      [itemsPerPage]="itemsPerPage"
      [pageIndex]="pageIndex"
    ></app-pagination-on-signals>
  `,
  imports: [CommonModule, PagerComponent, PaginationOnSignalsComponent],
})
export class AppComponent {
  public readonly itemsPerPage$$ = new BehaviorSubject<number>(10);
  public readonly total$$ = new BehaviorSubject<number>(263);
  public readonly pageIndex$$ = new BehaviorSubject<number>(0);

  readonly itemsPerPage = signal(10);
  readonly total = signal(263);
  readonly pageIndex = signal(0);
}
