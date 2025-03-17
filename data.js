const Devices = [
    {
        "name": "Cảm biến nhiệt độ & độ ẩm",
        "userId": "",
        "attrs": [{
            "key": "temperature",
            "valueType": "value",
            "feed": "phngngoc/feeds/temp"
        },
        {
            "key": "humidity",
            "valueType": "value",
            "feed": "phngngoc/feeds/humidity"
        },]
    },
    {
        "name": "Cảm biến lửa",
        "userId": "",
        "attrs": [{
            "key": "fire",
            "valueType": "value",
            "feed": "phngngoc/feeds/fire"
        },]
    },
    {
        "name": "Cảm biến chuyển động",
        "userId": "",
        "attrs": [{
            "key": "move",
            "valueType": "value",
            "feed": "phngngoc/feeds/move"
        }]
    },
    {
        "name": "Đèn",
        "userId": "",
        "attrs": [{
            "key": "status",
            "valueType": "value",
            "feed": "phngngoc/feeds/rgb"
        }]
    },
    {
        "name": "Quạt",
        "userId": "",
    },
    {
        "name": "Relay",
        "userId": "",
    },
    {
        "name": "Động cơ bơm nước",
        "userId": "",
        "attrs": [{
            "key": "status",
            "valueType": "value",
            "feed": "phngngoc/feeds/usb"
        }]
    },
    {
        "name": "Cảm biến chất lượng không khí",
        "userId": "",
    }
]


const DeviceAttrs = [


    {
        "key": "status",
        "valueType": "value",
        "feed": "phngngoc/feeds/notyet"
    },
    {
        "key": "status",
        "valueType": "value",
        "feed": "phngngoc/feeds/relay"
    },

]

const SystemRules = [
    {
        "deviceAttrId": "",
        "compareType": "",
        "value": "",
        "actions": [
            {
                "deviceAttrId": "",
                "value": ""
            }
        ]
    }
]

const Notification = [
    {
        "message": "test message",
        "title": "test title",
        "type": "alert"
    }
]

const Schedule = [
    {
        "time": "",
        "deviceAttrId": "",
        "value": "",
        "repeat": "",
    }
]

const UpdateSchedule = {
    "time": "",
    "deviceAttrId": "",
    "value": 1.0,
    "repeat": "",
    "isActive": true
}