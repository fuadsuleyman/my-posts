import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  constructor(private matDialog: MatDialog){}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error ocurred!"
        if(error.error.message){
          errorMessage = error.error.message;
        }
        this.matDialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);
      })
    )
  }
}


// {data: {message: errorMessage}






