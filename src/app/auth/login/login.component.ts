import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSub: Subscription;

  constructor(private authService: AuthService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.authStatusListener.subscribe(authStatus => {
      this.isLoading = false;
      
    })
  }

  onLogin(f: NgForm) {
    console.log("Form ", f.value.email, f.value.password);
    if (f.invalid) {
      return
    }
    this.isLoading = true;
    this.authService.login(f.value.email, f.value.password)
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
