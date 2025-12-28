import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.page').then( m => m.CategoriesPage)
  },
  {
    path: 'categoryForm/:id',
    loadComponent: () => import('./pages/category-form/category-form.page').then( m => m.CategoryFormPage)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks.page').then( m => m.TasksPage)
  },
  {
    path: 'taskForm/:id',
    loadComponent: () => import('./pages/task-form/task-form.page').then( m => m.TaskFormPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
