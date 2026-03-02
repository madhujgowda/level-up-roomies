export class Chef {
    uid: string;
    pointsEarned: number;
    previousPoints: number;

    constructor(data: any) {
        this.uid = data.uid;
        this.pointsEarned = data.pointsEarned || 0;
        this.previousPoints = data.previousPoints || 0;
    }
}