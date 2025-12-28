import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from "../../services/category-service";
import { TaskService } from "../../services/task-service";
import { CategoryList } from "../../models/category-list";
import { Task } from "../../models/task";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  AlertController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton
  ]
})
export class TaskFormPage implements OnInit {

  private fb = inject(FormBuilder);
  private categoryService=  inject(CategoryService);
  private taskService=  inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertController = inject(AlertController);

  taskForm: FormGroup;
  categoryList: CategoryList[] = [];
  title: string = 'Crear tarea';
  isEdit: boolean = false;
  id: number = 0;
  errorMessage: string = '';

  constructor() {

    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      categoryId: [0, [Validators.required]],
    })
  }

  ngOnInit() {
    this.getAllCategories();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = this.id != 0;

    if (this.isEdit)
    {
      this.title = 'Editar tarea';
      this.getTaskById();
    }
  }

  goBack(): void
  {
    this.router.navigate(['/tasks']);
  }

  getValidationError(): string[]
  {
    const Errors: string[] = [];

    Object.keys(this.taskForm.controls).forEach((field) => {

      const controlErrors = this.taskForm.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError => {

          switch (fieldError)
          {
            case 'required':
              Errors.push(`El campo ${field} es obligatorio`);
              break;

            case 'maxLength':
              const requiredLength = controlErrors[fieldError].requiredLength;
              Errors.push(`El campo ${field} no debe tener mas de ${requiredLength}`);
              break;
          }
        });
      }
    });
    return Errors;
  }

  async saveChanges()
  {
    if (this.taskForm.valid)
    {
      const task: Task = {
        id: 0,
        name: this.taskForm.value.name,
        state: false,
        description: this.taskForm.value.description,
        categoryId: this.taskForm.value.categoryId,
      };

      if (this.isEdit)
      {
        console.log("Hola");
        this.updateTask(task);
      }
      else
      {
        this.createTask(task);
      }
    }
    else
    {
      const errors: string[] = this.getValidationError();
      const alert = await this.alertController.create({
        header: 'Antes de continuar debes solucionar los siguientes errores',
        message: errors.join('<br>'),
        buttons: ["Ok"]
      });
      await alert.present();
    }
  }

  getTaskById(): void
  {
    this.taskService.GetByIdTask(this.id).subscribe({
      next: (data) =>
      {
        console.log(data);
        this.taskForm.setValue({
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
        });
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: 'Ha ocurrido un error',
          message: this.errorMessage,
          buttons: ["Ok"]
        });
        await alert.present();
      }
    });
  }

  createTask(task:Task): void
  {
    this.taskService.CreateTask(task).subscribe({
      next: async (data) =>
      {
        const alert = await this.alertController.create({
          header: 'Exito',
          message: 'Se ha creado la tarea con exito',
          buttons: ["Ok"]
        });
        await alert.present();
        this.router.navigate(['/tasks']);
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: 'Ha ocurrido un error',
          message: this.errorMessage,
          buttons: ["Ok"]
        });
        await alert.present();
      }
    });
  }

  updateTask(task:Task): void
  {
    this.taskService.UpdateTask(task, this.id).subscribe({
      next: async (data) =>
      {
        console.log("success");
        const alert = await this.alertController.create({
          header: 'Exito',
          message: 'Se ha actualizado la tarea con exito',
          buttons: ["Ok"]
        });
        await alert.present();
        this.router.navigate(['/tasks']);
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: 'Ha ocurrido un error',
          message: this.errorMessage,
          buttons: ["Ok"]
        });
        await alert.present();
      }
    });
  }

  getAllCategories():void
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
          header: 'Ha ocurrido un error',
          message: this.errorMessage,
          buttons: ["Ok"]
        });
        await alert.present();
      }
    });
  }
}
