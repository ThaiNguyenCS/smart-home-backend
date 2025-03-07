import Observer from "./Observer";
import Subject from "./Subject";

class TemperatureSensor extends Subject {
    observers: Observer[] = [];
}
export default TemperatureSensor;
