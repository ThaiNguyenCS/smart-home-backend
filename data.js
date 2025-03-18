const Devices = [
    {
        "name": "Cảm biến nhiệt độ & độ ẩm",
        "userId": "",
        "attrs": [{
            "key": "temperature",
            "isListener": true,
            "feed": "phngngoc/feeds/temp"
        },
        {
            "key": "humidity",
            "isListener": true,
            "feed": "phngngoc/feeds/humidity"
        },]
    },
    {
        "name": "Cảm biến lửa",
        "userId": "",
        "attrs": [{
            "key": "fire",
            "isListener": true,
            "feed": "phngngoc/feeds/fire"
        },]
    },
    {
        "name": "Cảm biến chuyển động",
        "userId": "",
        "attrs": [{
            "key": "move",
            "isListener": true,
            "feed": "phngngoc/feeds/move"
        }]
    },
    {
        "name": "Đèn",
        "userId": "",
        "attrs": [{
            "key": "status",
            "isListener": false,
            "feed": "phngngoc/feeds/relay"
        }]
    },
    {
        "name": "Quạt",
        "userId": "",
        "attrs": [{
            "key": "status",
            "isListener": false,
            "feed": "phngngoc/feeds/fan"
        }]
    },

    {
        "name": "Động cơ bơm nước",
        "userId": "",
        "attrs": [{
            "key": "status",
            "isListener": false,
            "feed": "phngngoc/feeds/usb"
        }]
    },
    {
        "name": "Cảm biến chất lượng không khí",
        "userId": "",
    }
]


const updateDeviceAttr = {
    "key": "lightIndex",
    "value": 1.0,
    "isPublisher": false
}
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