import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PagerComponent } from './pager/pager.component';

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
  `,
  imports: [CommonModule, PagerComponent],
})
export class AppComponent {
  public readonly itemsPerPage$$ = new BehaviorSubject<number>(10);
  public readonly total$$ = new BehaviorSubject<number>(263);
  public readonly pageIndex$$ = new BehaviorSubject<number>(0);
}
