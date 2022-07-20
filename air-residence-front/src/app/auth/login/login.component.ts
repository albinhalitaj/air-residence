import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    loading = false;
    authSubscription$: Subscription;

    submitForm(): void {
        this.loading = true;
        this.authSubscription$ = this.auth.login(this.username.value, this.password.value)
          .subscribe(() => {
            this.loading = false;
            this.router.navigate(['/dashboard']).then();
          }, () => {
            this.loading = false;
            this.notification.create(
              'error',
              'Gabim: Akses i paautorizuar',
              'Emri i përdoruesit ose fjalëkalimi është i pavlefshëm! Ju lutemi provoni përsëri',
            );
          });
    }

  constructor(private fb: FormBuilder,
              private router: Router,
              private auth: AuthenticationService,
              private notification: NzNotificationService) { }

  ngOnInit(): void {
      this.loginForm = this.fb.group({
          userName: [ null, [ Validators.required ] ],
          password: [ null, [ Validators.required ] ]
      });
  }

  get username(): AbstractControl {
      return this.loginForm.get('userName');
  }

  get password(): AbstractControl {
      return this.loginForm.get('password');
  }

  ngOnDestroy(): void {
      if (this.authSubscription$) {
        this.authSubscription$.unsubscribe();
      }
  }
}
