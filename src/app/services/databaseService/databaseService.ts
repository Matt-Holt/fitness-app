import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection }  from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { session, workout } from 'src/app/Models/model';

@Injectable({
  providedIn: 'root'
})
export class databaseService {
  private sqLite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  public dbReady$ = new BehaviorSubject<Boolean>(false);
  private db!: SQLiteDBConnection;
  private dbName: string = 'fitness-db.db';

  //Tables
  private workoutTable: string = "workouts";
  private sessionsTable: string = "sessions";

  constructor() {
    this.init();
  }

  async init() {
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

      this.dbReady$.next(true);
  }

  async getAllWorkouts(): Promise<workout[]> {
    if (!this.dbReady$.getValue()) {
      throw new Error("Database is not defined.");
    }

    const result = await this.db.query(`SELECT * FROM ${this.workoutTable};`);
    console.log('All workouts: ');
    console.log(result);
    return result.values as workout[] || [];
  }

  async addWorkout(workout: workout) {
      const statement = `INSERT INTO ${this.workoutTable} (name, weightPB, repPB)
        VALUES (${workout.name}, ${workout.weightPB}, ${workout.repPB});`;
      await this.db.execute(statement);
  }

  async getAllSessions(): Promise<session[]> {
    if (!this.dbReady$.getValue()) {
      throw new Error("Database is not defined.");
    }

    const result = await this.db.query(`SELECT * FROM ${this.sessionsTable};`);
    console.log('All sessions: ');
    console.log(result);
    return result.values as session[] || [];
  }

  async addSession(session: session) {
    const statement = `INSERT INTO ${this.sessionsTable} (workoutId, weightKG, reps)
        VALUES (${session.workoutId}, ${session.weightKG}, ${session.reps});`;
      await this.db.execute(statement);
  }
}
