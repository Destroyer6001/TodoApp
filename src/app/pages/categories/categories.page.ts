import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService} from "../../services/category-service";
import { CategoryList} from "../../models/category-list";
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  AlertController
} from '@ionic/angular/standalone';
import {RouterModule, Router} from "@angular/router";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    FormsModule
  ]
})
export class CategoriesPage {

  private categoryService = inject(CategoryService);
  private alertController = inject(AlertController);
  private router = inject(Router);

  listCategories: CategoryList[] = [];
  errorMessage: string = "";


  constructor() { }

  ionViewWillEnter() {
    this.IndexCategories();
  }

  IndexCategories():void
  {
    this.categoryService.GetAllCategories().subscribe({
      next: (data) =>
      {
        this.listCategories = data;
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: "Ha ocurrido un error",
          message: this.errorMessage,
          buttons: ['Ok']
        });
        await alert.present();
      }
    });
  }

  async ConfirmDelete(id: number)
  {
    const alert = await this.alertController.create({
      header: 'Atencion',
      message:  'Esta seguro de eliminar la categoria?',
      buttons: [
        {text: 'Cancelar', role: 'cancel'},
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.DeleteCategory(id);
          }
        }
      ]
    });

    await alert.present();
  }

  DeleteCategory(id:number):void
  {
    this.categoryService.DeleteCategory(id).subscribe({
      next: async (data) =>
      {
        const alert = await this.alertController.create({
          header: "Exito",
          message: "Se ha eliminado con exito la categoria",
          buttons: ['Ok']
        });
        this.IndexCategories();
        await alert.present();
      },
      error: async (error) =>
      {
        this.errorMessage = error.message;
        const alert = await this.alertController.create({
          header: "Error",
          message: this.errorMessage,
          buttons: ['Ok']
        });
        this.IndexCategories();
        await alert.present();
      }
    });
  }

  redirectForm(id:number): void
  {
    this.router.navigate(['categoryForm',id]);
  }
}
