const Devices = [
    {
        "name": "Cảm biến nhiệt độ & độ ẩm",
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
        "attrs": [{
            "key": "fire",
            "valueType": "value",
            "feed": "phngngoc/feeds/fire"
        },]
    },
    {
        "name": "Cảm biến chuyển động",
        "attrs": [{
            "key": "move",
            "valueType": "value",
            "feed": "phngngoc/feeds/move"
        }]
    },
    {
        "name": "Đèn",
        "attrs": [{
            "key": "status",
            "valueType": "value",
            "feed": "phngngoc/feeds/rgb"
        }]
    },
    {
        "name": "Quạt"
    },
    {
        "name": "Relay"
    },
    {
        "name": "Động cơ bơm nước",
        "attrs": [{
            "key": "status",
            "valueType": "value",
            "feed": "phngngoc/feeds/usb"
        }]
    },
    {
        "name": "Cảm biến chất lượng không khí"
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