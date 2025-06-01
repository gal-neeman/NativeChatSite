import { inject, Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackbarService = inject(SnackbarService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            snackbarService.showError(error.error);

            return of(null);
        })
    );
};