import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorder, IonReorderGroup, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { databaseService } from 'src/app/services/databaseService/databaseService';
import { workout } from 'src/app/Models/model';
import { IonButton, IonicModule, IonInput } from '@ionic/angular';
import { AlertService } from 'src/app/services/alertService/alert-service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
  standalone: true,
  imports: [IonContent, IonicModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonReorder, IonReorderGroup, IonItem, IonLabel, IonList]
})
export class WorkoutsPage implements OnInit {

  workoutList: workout[] = [];
  newWorkout: workout = { name: '', weightPB: 0, repPB: 0 };
  selectedWorkoutId = '';

  constructor(private databaseService: databaseService, private alertService: AlertService) {
    this.init();
  }

  async init() {
    this.databaseService.workouts$.subscribe(async result => {
      if (result) {
        this.workoutList = result;
      }
    });
  }

  async addWorkout() {
    await this.databaseService.addWorkout(this.newWorkout);
  }

  async selectWorkout(id: number | undefined) {
    const idStr = '' + id;
    if (this.selectedWorkoutId == idStr) {
      this.selectedWorkoutId = '';
    }
    else {
      this.selectedWorkoutId = '' + id;
    }
  }

  isSelectedWorkout(id: number | undefined) {
    return ('' + id) == this.selectedWorkoutId;
  }

  ngOnInit() { }

}
