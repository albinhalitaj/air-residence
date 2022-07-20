import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Observable } from 'rxjs';
import { User } from '../shared/interfaces/user.type';

@Component({
  selector: 'app-profile',
  template: `
    <div class="container">
      <nz-card *ngIf="currentUser$ | async as user">
        <div class="row align-items-center">
          <div class="col-md-7">
            <div class="d-md-flex align-items-center">
              <div class="text-center text-sm-left ">
                <nz-avatar
                  class="shadow-sm m-v-15"
                  [nzSize]="150"
                  nzSrc="assets/images/avatars/avatar.jpg"
                ></nz-avatar>
              </div>
              <div class="text-center text-sm-left m-v-15 p-l-30">
                <h2 class="m-b-5">{{ user.name }} {{ user.surname }}</h2>
                <p class="text-opacity font-size-13">@{{ user.username }}</p>
                <p class="text-dark m-b-20">
                  Frontend Developer, UI/UX Designer
                </p>
                <button nz-button nzType="primary">Kontakti</button>
              </div>
            </div>
          </div>
          <div class="col-md-5">
            <div class="row">
              <div class="d-md-block d-none border-left col-1"></div>
              <div class="col">
                <ul class="list-unstyled m-t-10">
                  <li class="row">
                    <p
                      class="col-sm-3 col-4 font-weight-semibold text-dark m-b-5"
                    >
                      <i
                        class="m-r-10 text-primary"
                        nz-icon
                        nzType="mail"
                        theme="outline"
                      ></i>
                      <span>Emaili: </span>
                    </p>
                    <p class="col font-weight-semibold">{{ user.email }}</p>
                  </li>
                  <li class="row">
                    <p
                      class="col-sm-3 col-4 font-weight-semibold text-dark m-b-5"
                    >
                      <i
                        class="m-r-10 text-primary"
                        nz-icon
                        nzType="phone"
                        theme="outline"
                      ></i>
                      <span>Telefoni: </span>
                    </p>
                    <p *ngIf="user.phone" class="col font-weight-semibold">
                      {{ user.phone }}
                    </p>
                    <p *ngIf="!user.phone" class="col font-weight-semibold">
                      N/A
                    </p>
                  </li>
                  <li class="row">
                    <p
                      class="col-sm-3 col-4 font-weight-semibold text-dark m-b-5"
                    >
                      <i
                        class="m-r-10 text-primary"
                        nz-icon
                        nzType="compass"
                        theme="outline"
                      ></i>
                      <span>Vendi: </span>
                    </p>
                    <p *ngIf="user.place" class="col font-weight-semibold">
                      {{ user.place }}
                    </p>
                    <p *ngIf="!user.place" class="col font-weight-semibold">
                      N/A
                    </p>
                  </li>
                </ul>
                <div class="d-flex font-size-22">
                  <a href="" class="text-gray p-r-20">
                    <i nz-icon nzType="facebook" theme="outline"></i>
                  </a>
                  <a href="" class="text-gray p-r-20">
                    <i nz-icon nzType="twitter" theme="outline"></i>
                  </a>
                  <a href="" class="text-gray p-r-20">
                    <i nz-icon nzType="behance" theme="outline"></i>
                  </a>
                  <a href="" class="text-gray p-r-20">
                    <i nz-icon nzType="dribbble" theme="outline"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nz-card>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  currentUser$: Observable<User> = this.auth.currentUser;

  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {}
}
