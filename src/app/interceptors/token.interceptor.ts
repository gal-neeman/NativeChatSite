import { HttpInterceptorFn } from "@angular/common/http";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem("token");

    // Inject JWT token to the request header if there is one
    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(clonedReq);
    }

    return next(req);
}