import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from "../../services/category-service";
import { TaskService } from "../../services/task-service";
import { CategoryList} from "../../models/category-list";
import { TaskList } from "../../models/task-list";
import { RouterModule, Router} from "@angular/router";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonList,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  AlertController
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonList,
    IonLabel,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class TasksPage {

  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);
  private alertController = inject(AlertController);
  private router = inject(Router);

  categoryList: CategoryList[] = [];
  taskList: TaskList[] = [];
  taskListAux: TaskList[] = [];
  errorMessage: string = '';

  constructor() { }

  ionViewWillEnter(){
    this.getCategories();
    this.getAllTasks();
  }

  getAllTasks():void
  {
    this.taskService.GetAllTask().subscribe({
      next: (data) =>
      {
        this.taskList = data;
        this.taskListAux = data;
        console.log(data);
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK']
        });

        await alert.present();
      }
    });
  }

  getCategories():void
  {
    this.categoryService.GetAllCategories().subscribe({
      next: (data) =>
      {
        this.categoryList = data;
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  deleteTask(id:number):void
  {
    this.taskService.DeleteTask(id).subscribe({
      next: async (data) =>
      {
        const alert = await this.alertController.create({
          header: "Exito",
          message: "Se ha eliminado con exito la tarea",
          buttons: ['OK']
        });
        this.getAllTasks();
        await alert.present();
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK']
        });
        this.getAllTasks();
        await alert.present();
      }
    });
  }

  changeStatus(id:number):void
  {
    this.taskService.UpdateStateTask(id).subscribe({
      next: async (data) =>
      {
        const alert = await this.alertController.create({
          header: "Exito",
          message: "Se ha actualizado con exito el estado de la tarea",
          buttons: ['OK']
        });
        this.getAllTasks();
        await alert.present();
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK']
        });
        this.getAllTasks();
        await alert.present();
      }
    });
  }

  onFilterChange(event:any):void
  {
    const filter = event.target.value;

    if (filter == 0)
    {
      this.taskListAux = this.taskList;
    }
    else
    {
      this.taskListAux = this.taskList.filter(p => p.categoryId == filter);
    }
  }

  async confirmDeleteTask(id:number)
  {
    const alert = await  this.alertController.create({
      header: "Atencion",
      message: 'Esta seguro de querer eliminar la tarea',
      buttons: [
        {text: 'Cancelar', role: 'cancel'},
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteTask(id);
          }
        }
      ]
    });

    await alert.present();
  }

  redirectPage(id:number):void
  {
    this.router.navigate(['taskForm', id]);
  }

}
