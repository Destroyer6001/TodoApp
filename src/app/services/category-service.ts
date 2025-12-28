import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, map, throwError, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from "../models/api-response";
import {Category} from "../models/category";
import {CategoryList} from "../models/category-list";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private apiUrl = `https://todoapi-op0h.onrender.com/api`;
  private http = inject(HttpClient);

  constructor() {}

  CreateCategory(category:Category): Observable<Category>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, category, {headers}).pipe(
      map((res) => {
        if (!res.isSuccess)
        {
          throw Error(res.message);
        }
        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  UpdateCategory(category:Category, id:number): Observable<Category>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, category, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  DeleteCategory(id: number):Observable<Category>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  GetByIdCategory(id: number): Observable<Category>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  GetAllCategories():Observable<CategoryList[]>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<ApiResponse<CategoryList[]>>(`${this.apiUrl}/categories`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }
        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  private handlerError(error: HttpErrorResponse)
  {
    let errorMsg = "Error desconocido";

    if (error.error instanceof ErrorEvent)
    {
      errorMsg = `Error en el cliente: ${error.error.message}`;
    }
    else if (!error.error)
    {
      errorMsg = error.message;
    }
    else
    {
      if (typeof error.error === 'string')
      {
        try
        {
          const parsed = JSON.parse(error.error);
          errorMsg = parsed.message;
        }
        catch
        {
          errorMsg = error.error;
        }
      }
    }
    return throwError(() => new Error(errorMsg));
  }
}
