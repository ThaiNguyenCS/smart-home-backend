import Observer from "./Observer";

class Subject {
    observers: Observer[];
    constructor() {
        this.observers = [];
    }

    attach(observer: Observer) {
        this.observers.push(observer);
    }

    detach(observer: Observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notify(data: any): void {
        this.observers.forEach((observer) => observer.update(data));
    }
}

export default Subject;
