// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "./database";

// interface DeviceAttrs {
//     id: string;
//     feed: string;
//     roomId: string;
//     name: string;
// }

// // interface DeviceCreationAttrs extends Optional<DeviceAttrs, >;

// interface DeviceInstance extends Model<DeviceAttrs, DeviceAttrs>, DeviceAttrs {}

// const Device = sequelize.define<DeviceInstance>(
//     "Device",
//     {
//         id: {
//             primaryKey: true,
//             type: DataTypes.STRING,
//         },
//         feed: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         roomId: {
//             type: DataTypes.STRING,
//             references: {
//                 key: "id",
//                 model: "Rooms",
//             },
//         },
//     },
//     { updatedAt: false }
// );

// // Device.sync({force: true})

// export default Device;

import { DataTypes, Model } from "sequelize";
import sequelize from "./database";
import DeviceRepository from "../repository/DeviceRepository";
import DeviceAttribute from "./DeviceAttribute.model";

interface DeviceAttrs {
    id: string;
    roomId?: string | null;
    name: string;
    attributes?: DeviceAttribute[];
}

class Device extends Model<DeviceAttrs> implements DeviceAttrs {
    public id!: string;
    public roomId!: string | null;
    public name!: string;
    private deviceRepository = new DeviceRepository();
    public attributes: DeviceAttribute[] = [];
    public async loadDeviceAttrs(data: any) {
        const attrs = await this.deviceRepository.getDeviceAttr({ deviceId: this.id });
        this.attributes = attrs;
    }

    public containsFeed(feed: string) {
        return this.attributes.find((attr) => attr.feed === feed);
    }

    public async updateDeviceStatus(data: any) {
        const { feed, value } = data;
        const attr = this.containsFeed(feed);
        if (attr) await attr.updateStatus(value);
    }
}

Device.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Rooms",
            },
        },
    },
    {
        sequelize,
        updatedAt: false, // Disables updatedAt field
    }
);
// Device.sync({ alter: true });

export default Device;
