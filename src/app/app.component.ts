import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader, IonIcon, IonItem, IonLabel,
  IonList,
  IonMenu, IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {cube, home, list} from "ionicons/icons";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonHeader, IonMenu, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, RouterModule, IonMenuToggle],
})
export class AppComponent {
  constructor() {}

  protected readonly home = home;
  protected readonly list = list;
  protected readonly cube = cube;
}
