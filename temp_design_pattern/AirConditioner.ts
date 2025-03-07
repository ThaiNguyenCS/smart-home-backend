import Observer from "./Observer";

class AirConditioner implements Observer {
    constructor() {}
    update(data: any): void {
        console.log(`Do something with ${data}`);
        
    }
}

export default AirConditioner;
