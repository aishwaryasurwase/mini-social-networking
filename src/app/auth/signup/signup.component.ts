import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading: boolean;

  constructor(private authService: AuthService, private _snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  onSignup(f: NgForm) {
    console.log("Form ", f.value.email, f.value.password);
    if (f.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.signup(f.value.email, f.value.password).subscribe(res => {
      console.log(res);
      this.isLoading = false;
      this._snackbar.open(`User created successfully`, 'X', {
        duration: 3000
      });
      this.router.navigate(['/']);
    }, err => {
      console.log("error ", err);
      this._snackbar.open(`Error, expected email to be unique`, 'X', {
        duration: 3000
      })
      this.isLoading = false;
    })

  }

}
