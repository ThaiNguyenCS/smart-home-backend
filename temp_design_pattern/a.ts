import AirConditioner from "./AirConditioner";
import TemperatureSensor from "./TemperatureSensor";

const tempSensor = new TemperatureSensor();
const airConditioner = new AirConditioner();
tempSensor.attach(airConditioner);
tempSensor.notify("ahihi");
