import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';

type ViewModel = {
  itemFrom: number;
  itemTo: number;
  total: number;
  previousDisabled: boolean;
  nextDisabled: boolean;
  pageIndex: number;
  itemsPerPage: number;
};

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Solution with Rxjs & Async Pipe 🙌</h2>
    <ng-container *ngIf="vm$ | async as vm">
      Showing {{ vm.itemFrom }} to {{ vm.itemTo }} of {{ vm.total }} entries
      <button (click)="goToStart()" [disabled]="vm.previousDisabled">
        Begin
      </button>
      <button (click)="previous(vm)" [disabled]="vm.previousDisabled">
        Previous
      </button>
      <button (click)="next(vm)" [disabled]="vm.nextDisabled">Next</button>
      <button (click)="goToEnd(vm)" [disabled]="vm.nextDisabled">End</button>
    </ng-container>
  `,
})
export class PagerComponent {
  private readonly itemsPerPage$$ = new BehaviorSubject<number>(0);
  private readonly total$$ = new BehaviorSubject<number>(0);
  private readonly pageIndex$$ = new BehaviorSubject<number>(0);

  @Input() public set itemsPerPage(v: number | null) {
    if (typeof v === 'number') {
      this.itemsPerPage$$.next(v);
    }
  }
  @Input() public set total(v: number | null) {
    if (typeof v === 'number') {
      this.total$$.next(v);
    }
  }
  @Input() public set pageIndex(v: number | null) {
    if (typeof v === 'number') {
      this.pageIndex$$.next(v);
    }
  }

  /**
   * Notifies the parent when the page has changed
   */
  @Output() public readonly pageIndexChange = new EventEmitter<number>();

  public readonly vm$: Observable<ViewModel> = combineLatest({
    itemsPerPage: this.itemsPerPage$$.pipe(distinctUntilChanged()),
    total: this.total$$.pipe(distinctUntilChanged()),
    pageIndex: this.pageIndex$$.pipe(distinctUntilChanged()),
  }).pipe(
    map(({ itemsPerPage, total, pageIndex }) => {
      return {
        total,
        itemsPerPage,
        pageIndex,
        previousDisabled: pageIndex === 0,
        nextDisabled: pageIndex >= Math.ceil(total / itemsPerPage) - 1,
        itemFrom: pageIndex * itemsPerPage + 1,
        itemTo:
          pageIndex < Math.ceil(total / itemsPerPage) - 1
            ? pageIndex * itemsPerPage + itemsPerPage
            : total,
      };
    })
  );
  public goToStart(): void {
    this.pageIndexChange.emit(0);
  }

  public next(vm: ViewModel): void {
    this.pageIndexChange.emit(vm.pageIndex + 1);
  }

  public previous(vm: ViewModel): void {
    this.pageIndexChange.emit(vm.pageIndex - 1);
  }

  public goToEnd(vm: ViewModel): void {
    this.pageIndexChange.emit(Math.ceil(vm.total / vm.itemsPerPage) - 1);
  }
}
