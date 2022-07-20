import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResidencesService} from '../../shared/services/residences.service';
import {Observable, Subject} from 'rxjs';
import {ResidenceType} from '../../shared/interfaces/residence.type';
import {LoadingService} from '../../shared/services/loading.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {map, takeUntil, tap} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ResidenceImagesType} from '../../shared/interfaces/residence-images.type';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ResidencesStore} from '../residences.store';

@Component({
  selector: 'app-residence-details',
  templateUrl: './residence-details.component.html',
  styles: [],
  providers: [ResidencesStore]
})
export class ResidenceDetailsComponent implements OnInit, OnDestroy {

  residence$: Observable<ResidenceType>;
  residenceId: string = '';
  isEditMode: boolean = false;
  residenceForm: FormGroup;
  fileList: NzUploadFile[] = [];
  removedImages: string[] = [];
  formData: FormData = new FormData();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private residenceService: ResidencesService,
              private loader:LoadingService,
              private fb: FormBuilder,
              private modal: NzModalService,
              private notification: NzNotificationService) {
    this.route.params.pipe(
      tap(params => this.residenceService.selectResidence(params['id'])),
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.residenceId = params.id;
    });
  }

  onFileRemove(image: NzUploadFile): void {
    this.removedImages = this.removedImages.concat(image.url);
    this.fileList = this.fileList.filter((img: NzUploadFile) => img.name !== image.name)
    console.log("File List",this.fileList);
  }

  onFileSubmit(image: NzUploadFile): void {
    this.fileList = this.fileList.concat(image);
  }

  ngOnInit(): void {
    this.residenceService.residences$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.residence$ = this.residenceService.residenceDetails$.pipe(
        takeUntil(this.destroy$),
        tap((residence: ResidenceType) => {
          this.setFileList(residence);
          this.setFormValues(residence);
        }),
      );
    });
    this.residenceForm = this.fb.group(this.residenceService.controlsConfig);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  save(): void {
    this.fileList.forEach((file: any) => this.formData.append("Images",file));
    this.removedImages.forEach((img: string) => this.formData.append("deleteImage",img));
    this.formData.append("request",JSON.stringify(this.residenceForm.value));
    this.residenceService.update(this.residenceId,this.formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showNotification("Sukses!","Rekordi është përditësuar me sukses!",'success')
      }, () => {
        this.showNotification("Gabim!","Diqka Shkoi gabim! Ju lutem provoni përsëri!",'error')
      });
    this.isEditMode = !this.isEditMode;
  }


  setFormValues(residence: ResidenceType): void {
    this.residenceForm.setValue({
      title: residence.title,
      description: residence.description,
      category: residence.category,
      address: residence.address,
      city: residence.city,
      country: residence.country,
      zipCode: residence.zipCode,
      ownerName: residence.ownerName,
      email: residence.email,
      price: residence.price,
      status: 'E lirë',
      phone: residence.phone
    })
  }

  setFileList(residence: ResidenceType): void {
    residence.images.forEach((image: ResidenceImagesType) => {
      const imageName = image.key.slice(44);
      const file: NzUploadFile = {
        name: imageName,
        uid: image.id,
        url: image.url
      }
      this.fileList.push(file)
    })
  }

  download(): void {
    let images = []
    this.residenceService.residenceDetails$.pipe(
      map((data: ResidenceType) => data.images),
      takeUntil(this.destroy$)
    ).subscribe((imgs: ResidenceImagesType[]) => {
        images = imgs
    })
    for (let x of images) {
      const parts = x.url.split("/");
      const key = `${parts[3]}/${parts[4]}`
      console.log(parts[5])
      this.residenceService.getImage(parts[5])
        .pipe(takeUntil(this.destroy$))
      .subscribe((data: Blob) => {
        let a = document.createElement('a');
        a.download = x.key.slice(37);
        a.href = window.URL.createObjectURL(data);
        a.click();
      })
    }
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
}
