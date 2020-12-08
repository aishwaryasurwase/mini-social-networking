import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // console.log("Error", error);
                // alert(error.error.message);
                let errorMessgage = 'An unknown error occured!';
                if (error.error.message) {
                    errorMessgage = error.error.message;
                }
                this.dialog.open(ErrorDialogComponent, { data: { message: errorMessgage } })
                return throwError(error);
            })
        );
    }
}