export interface workout {
    id: number;
    name: string;
    weightPB: number;
    repPB: number;
}

export interface session {
    id: number;
    workoutId: number;
    weightKG: number;
    reps: number;
}