export class WeeklyCleaningTask {
    uid: string;
    task: string;
    status: string;

    constructor(data: any) {
        this.uid = data.uid;
        this.task = data.task;
        this.status = data.status;
    }
}