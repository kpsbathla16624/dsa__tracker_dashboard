export interface Iquestion{
    userId:string;
    name:string;
    QuestionNumber:string;
    platform:string;
    link:string;
    completedTime: string;
    status:status;
    remarks:string;
    code:string;
    category:string,
}

export enum status{
    pending= 'pending',
    completed = 'completed'
}

