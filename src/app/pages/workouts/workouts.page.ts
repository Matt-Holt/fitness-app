import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorder, IonReorderGroup, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { databaseService } from 'src/app/services/databaseService/databaseService';
import { workout } from 'src/app/Models/model';
import { IonButton, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
  standalone: true,
  imports: [IonContent, IonicModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonReorder, IonReorderGroup, IonItem, IonLabel, IonList]
})
export class WorkoutsPage implements OnInit {

  workoutList: workout[] = [];

  constructor(private databaseService: databaseService) {
    this.init();
  }

  async init() {
    this.databaseService.dbReady$.subscribe(async result => {
      if (result) {
        this.workoutList = await this.databaseService.getAllWorkouts();
      }
    });
  }

  async testMethod() {
    const result = await this.databaseService.getAllWorkouts();
    console.log(result);
  }

  ngOnInit() { }

}
