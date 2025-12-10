import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection }  from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { session, workout } from 'src/app/Models/model';
import { AlertService } from '../alertService/alert-service';
import { ToastService } from '../toastService/toast-service';

@Injectable({
  providedIn: 'root'
})
export class databaseService {
  private sqLite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  public workouts$ = new BehaviorSubject<workout[]>([]);
  public sessions$ = new BehaviorSubject<session[]>([]);
  private db!: SQLiteDBConnection;
  private dbName: string = 'fitness-db.db';
  private dbReady = false;

  //Tables
  private workoutTable: string = "workouts";
  private sessionsTable: string = "sessions";

  constructor(private alertService: AlertService, private toastService: ToastService) {
    this.init();
  }

  async init() {
    await this.createDatabase();      
      if (await this.getWorkoutCount() == 0) {
        this.seedDatabase();
      }
      this.workouts$.next(await this.getAllWorkouts());
      this.sessions$.next(await this.getAllSessions());
  }

  async seedDatabase() {
    await this.addWorkout({name: 'Squats', repPB: 0, weightPB: 0});
    await this.addWorkout({name: 'Deadlift', repPB: 0, weightPB: 0});
    await this.addWorkout({name: 'Bench press', repPB: 0, weightPB: 0});
  }

  async createDatabase() {
    await this.sqLite.checkConnectionsConsistency();
    await this.sqLite.closeAllConnections();
    this.db = await this.sqLite.createConnection(this.dbName, false, 'no-encryption', 1, false);
    await this.db.open();
    
    //Create workouts table
      let statement = `
        CREATE TABLE IF NOT EXISTS ${this.workoutTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        weightPB REAL,
        repPB INTEGER
        );
        `;
      await this.db.execute(statement);

    //Create sessions table
      statement = `
        CREATE TABLE IF NOT EXISTS ${this.sessionsTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutId INTEGER NOT NULL,
        weightKG REAL NOT NULL,
        reps INTEGER NOT NULL
        );
        `;
      await this.db.execute(statement);
      this.dbReady = true;
  }

  /////////////////////////////////////////WORKOUTS//////////////////////////////////////////////////////////////////////
  async getAllWorkouts(): Promise<workout[]> {
    if (!this.dbReady) {
      this.toastService.presentToast('Database is not defined.', 'danger');
      throw new Error("Database is not defined.");
    }

    const result = await this.db.query(`SELECT * FROM ${this.workoutTable};`);
    return result.values as workout[] || [];
  }

  async addWorkout(workout: workout) {
    if (!this.dbReady) {
      this.toastService.presentToast('Database is not defined.', 'danger');
      throw new Error("Database is not defined.");
    }

    //Insert into workout table
      const statement = `INSERT INTO ${this.workoutTable} (name, weightPB, repPB)
        VALUES ('${workout.name}', ${workout.weightPB}, ${workout.repPB});`;
      await this.db.execute(statement);

      //Update workout array
      const updatedWorkouts = [...this.workouts$.getValue(), workout];
      this.workouts$.next(updatedWorkouts);
  }

  async getWorkoutCount(): Promise<number> {
    if (!this.dbReady) {
      this.toastService.presentToast('Database is not defined.', 'danger');
      throw new Error("Database is not defined.");
    }

    const result = await this.db.query(`SELECT COUNT(*) AS count FROM ${this.workoutTable};`);
    if (!result || !result.values) { return 0; }
    else { return result.values[0].count; }
  }
  
  /////////////////////////////////////////SESSIONS//////////////////////////////////////////////////////////////////////
  async getAllSessions(): Promise<session[]> {
    if (!this.dbReady) {
      this.toastService.presentToast('Database is not defined.', 'danger');
      throw new Error("Database is not defined.");
    }

    const result = await this.db.query(`SELECT * FROM ${this.sessionsTable};`);
    return result.values as session[] || [];
  }

  async getSessionCount(): Promise<number> {
    if (!this.dbReady) {
      this.toastService.presentToast('Database is not defined.', 'danger');
      throw new Error("Database is not defined.");
    }
    
    const result = await this.db.query(`SELECT COUNT(*) AS count FROM ${this.sessionsTable};`);
    if (!result || !result.values) { return 0; }
    else { return result.values[0].count; }
  }

  async addSession(session: session) {
    if (!this.dbReady) {
      this.toastService.presentToast('Database is not defined.', 'danger');
      throw new Error("Database is not defined.");
    }
    
    //Insert into session table
    const statement = `INSERT INTO ${this.sessionsTable} (workoutId, weightKG, reps)
        VALUES ('${session.workoutId}', ${session.weightKG}, ${session.reps});`;
      await this.db.execute(statement);

      //Update session array
      const updatedSessions = [...this.sessions$.getValue(), session];
      this.sessions$.next(updatedSessions);
  }
}