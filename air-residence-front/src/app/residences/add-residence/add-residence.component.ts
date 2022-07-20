import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResidencesService } from '../../shared/services/residences.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-residence',
  template: `
    <div class="page-header has-tab">
      <div class="d-md-flex m-b-15 align-items-center">
        <div class="m-b-15">
          <button
            [nzLoading]="isLoading"
            [disabled]="!residenceForm.valid || fileList.length === 0"
            nz-button
            (click)="save()"
            nzType="primary"
          >
            <i nz-icon nzType="save" theme="outline"></i>
            <span>{{ isLoading ? 'Duke u ruajtur' : 'Ruaj' }}</span>
          </button>
        </div>
      </div>
    </div>
    <app-residence-form
      [form]="residenceForm"
      [isEdit]="false"
      (onFileSubmit)="handleOnFileSubmit($event)"
    ></app-residence-form>
  `,
  styleUrls: [],
})
export class AddResidenceComponent implements OnInit, OnDestroy {
  residenceForm: FormGroup;
  data: FormData = new FormData();
  isLoading: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  fileList: NzUploadFile[] = [];

  constructor(
    private fb: FormBuilder,
    private residenceService: ResidencesService,
    private router: Router,
    private loader: LoadingService,
    private notification: NzNotificationService
  ) {
    this.residenceForm = this.fb.group(this.residenceService.controlsConfig);
  }

  ngOnInit(): void {}

  handleOnFileSubmit(file: NzUploadFile) {
    this.fileList = this.fileList.concat(file);
  }

  save(): void {
    this.fileList.forEach((file: any) => {
      this.data.append('Images', file);
    });
    this.data.append(
      'request',
      JSON.stringify(this.residenceForm.getRawValue())
    );
    this.isLoading = true;
    this.residenceService
      .add(this.data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.isLoading = false;
          this.notification.create(
            'success',
            'Sukses! ',
            'Vendbanimi i ri është ruajtuar me sukses!'
          );
          this.router.navigate(['/residences']).then();
        },
        () => {
          this.notification.create(
            'error',
            'Ndodhi një gabim!',
            'Ndodhi një gabim. Ju lutem provoni përsëri!',
            { nzDuration: 2000 }
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
