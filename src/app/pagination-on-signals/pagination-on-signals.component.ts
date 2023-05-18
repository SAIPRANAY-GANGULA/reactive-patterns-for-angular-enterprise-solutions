import {
  Component,
  computed,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-on-signals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Solution with Signals ❤️</h2>
    <ng-container *ngIf="vm() as vm">
      Showing {{ vm.itemFrom }} to {{ vm.itemTo }} of {{ vm.total }} entries
      <button (click)="goToStart()" [disabled]="vm.previousDisabled">
        Begin
      </button>
      <button (click)="previous()" [disabled]="vm.previousDisabled">
        Previous
      </button>
      <button (click)="next()" [disabled]="vm.nextDisabled">Next</button>
      <button (click)="goToEnd()" [disabled]="vm.nextDisabled">End</button>
    </ng-container>
  `,
  styles: [],
})
export class PaginationOnSignalsComponent {
  @Input({ required: true }) total!: WritableSignal<number>;
  @Input({ required: true }) itemsPerPage!: WritableSignal<number>;
  @Input({ required: true }) pageIndex!: WritableSignal<number>;

  vm = computed(() => {
    return {
      total: this.total(),
      itemsPerPage: this.itemsPerPage(),
      pageIndex: this.pageIndex(),
      previousDisabled: this.pageIndex() === 0,
      nextDisabled:
        this.pageIndex() >= Math.ceil(this.total() / this.itemsPerPage()) - 1,
      itemFrom: this.pageIndex() * this.itemsPerPage() + 1,
      itemTo:
        this.pageIndex() < Math.ceil(this.total() / this.itemsPerPage()) - 1
          ? this.pageIndex() * this.itemsPerPage() + this.itemsPerPage()
          : this.total(),
    };
  });

  public goToStart(): void {
    this.pageIndex.set(0);
  }

  public next(): void {
    this.pageIndex.set(this.pageIndex() + 1);
  }

  public previous(): void {
    this.pageIndex.set(this.pageIndex() - 1);
  }

  public goToEnd(): void {
    this.pageIndex.set(Math.ceil(this.total() / this.itemsPerPage()) - 1);
  }
}
