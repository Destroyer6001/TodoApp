import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, map, throwError, pipe} from 'rxjs';
import {catchError} from "rxjs/operators";
import {ApiResponse} from "../models/api-response";
import {Task} from "../models/task";
import {TaskList} from "../models/task-list";

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private apiUrl = 'https://todoapi-op0h.onrender.com/api';
  private http= inject(HttpClient);

  constructor(){}

  public CreateTask(task: Task):Observable<Task>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<ApiResponse<Task>>(`${this.apiUrl}/tasks`, task, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  public UpdateTask(task: Task, id: number):Observable<Task>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/tasks/${id}`, task, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  public UpdateStateTask(id: number):Observable<Task>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.patch<ApiResponse<Task>>(`${this.apiUrl}/tasks/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  public DeleteTask(id: number):Observable<Task>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete<ApiResponse<Task>>(`${this.apiUrl}/tasks/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  public GetByIdTask(id: number):Observable<Task>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/tasks/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  public GetAllTask(): Observable<TaskList[]>
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<ApiResponse<TaskList[]>>(`${this.apiUrl}/tasks`, {headers}).pipe(
      map((res) => {

        if (!res.isSuccess)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse)
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
