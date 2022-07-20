import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {NzMessageService} from 'ng-zorro-antd/message';
import {editorConfig, ResidencesService} from '../../services/residences.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd/modal';

const getBase64: (file: File) => Promise<string | ArrayBuffer | null> = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-residence-form',
  template: `<form nz-form nzLayout="vertical" [formGroup]="form">
    <nz-tabset class="page-header-tab">
      <nz-tab nzTitle="Infot Bazike">
        <nz-card>
          <nz-form-item>
            <nz-form-label nzFor="title">Titulli</nz-form-label>
            <nz-form-control nzErrorTip="Ju lutem shkruani titullin!">
              <input nz-input formControlName="title" type="text">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzFor="price">Çmimi</nz-form-label>
            <nz-form-control [nzErrorTip]="validatePrice()">
              <nz-input-group [nzPrefix]="pricePrefix">
                <input nz-input formControlName="price" type="number">
              </nz-input-group>
              <ng-template #pricePrefix>
                <span>$</span>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzFor="category">Kategoria</nz-form-label>
            <nz-form-control nzErrorTip="Ju lutem shkruani kategorinë!">
              <nz-select formControlName="category" class="w-100">
                <nz-option nzLabel="Shtëpi" nzValue="Shtëpi"></nz-option>
                <nz-option nzLabel="Banesë" nzValue="Banesë"></nz-option>
                <nz-option nzLabel="Shtëpi për musafirë" nzValue="Shtëpi për musafirë"></nz-option>
                <nz-option nzLabel="Hotel" nzValue="Hotel"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzFor="status">Statusi</nz-form-label>
            <nz-form-control nzErrorTip="Please input this field!">
              <nz-select formControlName="status" class="w-100">
                <nz-option nzLabel="E lirë" nzValue="E lirë"></nz-option>
                <nz-option nzLabel="E padisponueshme" nzValue="E padisponueshme"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </nz-card>
      </nz-tab>
      <nz-tab nzTitle="Adresa">
        <nz-card>
          <nz-form-item>
            <nz-form-label nzFor="address">Adresa</nz-form-label>
            <nz-form-control nzErrorTip="Ju lutem shkruani adresën!">
              <input nz-input formControlName="address" type="text">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzFor="city">Qyteti</nz-form-label>
            <nz-form-control nzErrorTip="Ju lutem shkruani qytetin!">
              <input nz-input formControlName="city" type="text">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzFor="country">Shteti</nz-form-label>
            <nz-form-control nzErrorTip="Ju lutem shkruani shtetin!">
              <input nz-input formControlName="country" type="text">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Ju lutem shkruani postën">
              <nz-form-label nzFor="zipCode">Posta</nz-form-label>
              <input nz-input type="text" formControlName="zipCode" class="w-100" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Ju lutem shkruani emrin e plotë të pronarit!">
              <nz-form-label nzFor="ownerName">Emri i Plotë i Pronarit</nz-form-label>
              <input nz-input type="text" formControlName="ownerName" class="w-100" nzMode="tags"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control [nzErrorTip]="email.errors?.email ? 'Emaili nuk është valid' : 'Ju lutem shkruani emailin!'">
              <nz-form-label nzFor="email">Emaili</nz-form-label>
              <input nz-input type="email" formControlName="email" class="w-100" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Ju lutem shkurani një numër kontaktues!">
              <nz-form-label nzFor="phone">Telefoni</nz-form-label>
              <input nz-input type="text" formControlName="phone" class="w-100" nzMode="tags"/>
            </nz-form-control>
          </nz-form-item>
        </nz-card>
      </nz-tab>
      <nz-tab nzTitle="Pëshkrimi">
        <nz-card>
          <quill-editor formControlName="description" [style]="{height: '250px'}" [modules]="editorConfig" placeholder=""></quill-editor>
        </nz-card>
      </nz-tab>
      <nz-tab nzTitle="Imazhet">
        <nz-card>
          <nz-upload
            [nzMultiple]="true"
            [nzBeforeUpload]="beforeUpload"
            [(nzFileList)]="imageList"
            [nzLimit]="5 - imageList.length"
            [nzDisabled]="imageList.length === 5"
            [nzPreview]="handlePreview"
            [nzRemove]="remove"
            nzListType="picture-card">
            <i nz-icon nzType="plus"></i>
            <div class="ant-upload-text">Ngarko</div>
          </nz-upload>
          <nz-modal [nzStyle]="{'width':'100%'}" [nzVisible]="previewVisible" [nzContent]="modalContent" [nzFooter]="null" (nzOnCancel)="previewVisible=false">
            <ng-template #modalContent>
              <img [src]="previewImage" [ngStyle]="{'width':'100%'}" alt="Image" />
            </ng-template>
          </nz-modal>
        </nz-card>
      </nz-tab>
    </nz-tabset>
  </form>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResidenceFormComponent implements OnInit, OnDestroy {

  @Input() form: FormGroup;
  @Input() residenceId?: string;
  @Input() imageList?: NzUploadFile[] = [];
  @Input() isEdit: boolean;
  @Output() onFileSubmit: EventEmitter<NzUploadFile> = new EventEmitter<NzUploadFile>();
  @Output() onFileRemove: EventEmitter<NzUploadFile> = new EventEmitter<NzUploadFile>();
  previewImage: string = '';
  previewVisible: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  editorConfig: { toolbar: (string[] | { header: number; }[] | { list: string; }[] | { size: (string | boolean)[]; }[] | { align: any[]; }[])[]; };
  constructor(private message: NzMessageService) {
    this.editorConfig = editorConfig;
  }

  ngOnInit(): void {
    console.log(this.imageList);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.imageList = this.imageList.concat(file);
    if (this.imageList.length === 4) {
      this.message.warning('Nuk mund të ngarkoni më shumë se 5 foto!');
    } else {
      this.onFileSubmit.emit(file)
    }
    return false;
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  validatePrice(): string {
    if (this.price.errors?.required) {
      return "Ju lutem shkruani një çmim!";
    }
    if(this.price.errors?.min) {
      return "Çmimi duhet të jetë më i madh se 0!";
    }
    if (this.price.errors?.max) {
      return "Çmimi nuk mund të jetë më i madhë se 5000!";
    }
  }

  get price(): AbstractControl {
    return this.form.get('price')
  }

  get email(): AbstractControl {
    return this.form.get('email')
  }

  remove = (image: NzUploadFile): boolean => {
    if (this.isEdit && this.imageList.length === 1) {
      this.message.warning('Vendbanimi duhet të ketë së paku një foto!');
      return false;
    } else {
      this.onFileRemove.emit(image);
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
