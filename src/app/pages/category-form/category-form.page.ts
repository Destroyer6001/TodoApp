import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  AlertController,
} from '@ionic/angular/standalone';
import { CategoryService } from "../../services/category-service";
import { Category } from "../../models/category";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton
  ]
})
export class CategoryFormPage implements OnInit {

  private fb =  inject(FormBuilder);
  private alertController = inject(AlertController);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryForm: FormGroup;
  isEdit: boolean = false;
  title: string = "Crear categoria";
  errorMessage: string = "";
  id: number = 0;
  constructor()
  {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
    })
  }

  getValidationErrors(): string[]
  {
    const Errors: string[] = [];

    Object.keys(this.categoryForm.controls).forEach(field => {
      const controlErrors = this.categoryForm.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError => {
          switch (fieldError)
          {
            case 'required':
              Errors.push(`El campo ${field} es obligatorio`);
              break;

            case 'maxlength':
              const requiredLengh = controlErrors[fieldError].requiredLength;
              Errors.push(`El campo ${field} no debe tener mas de ${requiredLengh} caracteres`);
              break;
          }
        });
      }
    });
    return Errors;
  }

  getCategoryById():void
  {
    this.categoryService.GetByIdCategory(this.id).subscribe({
      next: (result) =>
      {
        this.categoryForm.setValue({
          name: result.name,
        });
      },
      error: async (err) =>
      {
        this.errorMessage = err.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }

  async saveChanges()
  {
    if (this.categoryForm.valid)
    {
      const category: Category = {
        name: this.categoryForm.value.name,
        id: 0
      };

      if (this.isEdit)
      {
        this.updateCategory(category);
      }
      else
      {
        this.createCategory(category);
      }
    }
    else
    {
      const errors: string[] = this.getValidationErrors();
      const alert = await this.alertController.create({
        header: "Antes de continuar debes solucionar los siguientes errores",
        message: errors.join("<br>"),
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  createCategory(category: Category): void
  {
    this.categoryService.CreateCategory(category).subscribe({
      next: async (result) =>
      {
        const alert = await this.alertController.create({
          header: "Exito",
          message: "Se ha creado con exito la nueva categoria",
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/categories']);

      },
      error: async (err) =>
      {
        this.errorMessage = err.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK'],
        });
        await alert.present();
      }
    })
  }

  updateCategory(category: Category): void
  {
    this.categoryService.UpdateCategory(category, this.id).subscribe({
      next: async (result) =>
      {
        const alert = await this.alertController.create({
          header: "Exito",
          message: "Se ha actualizado con exito la categoria",
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/categories']);
      },
      error: async (err) =>
      {
        this.errorMessage = err.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['OK'],
        });
        await alert.present();
      }
    })
  }

  goBack():void
  {
    this.router.navigate(['/categories']);
  }

  ngOnInit()
  {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.isEdit = this.id != 0;
    if (this.isEdit)
    {
      this.title = "Editar categoria";
      this.getCategoryById();
    }
  }
}
