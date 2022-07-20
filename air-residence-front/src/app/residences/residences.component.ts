import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ResidencesService } from '../shared/services/residences.service';
import { EMPTY, Observable, Subject} from 'rxjs';
import { ResidenceType } from '../shared/interfaces/residence.type';
import { LoadingService } from '../shared/services/loading.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-residences',
  templateUrl: 'residences.component.html',
  styles: [],
})
export class ResidencesComponent implements OnInit, OnDestroy {

  isLoading: Observable<boolean> = this.loader.loadingAction$;
  deleteLoading: boolean = false;
  selectedCategory: string = 'Të gjitha';
  selectedStatus: string = 'Të gjitha';
  searchInput: FormControl = new FormControl("");
  destroy$: Subject<boolean> = new Subject<boolean>();
  residences$: Observable<ResidenceType[]> = this.residenceService.residences$;
  filteredResidences$: Observable<ResidenceType[]> = this.residenceService.filteredResidences$;

  constructor(private residenceService: ResidencesService,
              private loader: LoadingService,
              private modal: NzModalService,
              private notification: NzNotificationService) { }

  ngOnInit(): void {

    this.residenceService.residences$.pipe(
      takeUntil(this.destroy$),
      catchError(() => {
        this.showNotification("Ndodhi një gabim!","Ju lutem rifreskojeni faqën.",'error');
        this.loader.hideLoading();
        return EMPTY;
      })
    ).subscribe();

    this.searchInput.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(val => this.residenceService.onInput(val));
  }

  select(event: string): void {
    this.residenceService.select(event);
  }

  identify(item,index): string {
    return item.id;
  }

  showConfirm(residence: ResidenceType): void {
      this.modal.confirm({
      nzTitle: 'A jeni i sigurtë që dëshironi të fshini këtë rekord me imazhet?',
      nzContent: 'Rekordi do të fshihet dhe ky hap nuk mund të kthehet mbrapa!',
        nzOkText: 'Po',
        nzCancelText: 'Anulo',
      nzOnOk: () => this.confirmDelete(residence),
      nzOkLoading: this.deleteLoading,
    });
  }

  confirmDelete(residence: ResidenceType): void {
    this.deleteLoading = true;
    this.residenceService.delete(residence).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.deleteLoading = false;
      this.showNotification("Fshirja u përfundua me sukses!","Rekordi është fshirë me sukses.","success");
    },() => {
      this.deleteLoading = false;
      this.showNotification("Gabim!","Ndodhi një gabim gjatë fshirjes së rekordit!","error")
    });
  }

  showNotification(title: string,message: string,notificationType: 'error' | 'success'): void {
    this.notification.create(
      notificationType,
      title,
      message,
      {
        nzDuration: 1500
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
