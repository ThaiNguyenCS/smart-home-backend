import { DataTypes, Model } from "sequelize";
import sequelize from "./database";

interface DeviceLogAttrs {
    id: string;
    deviceAttrId: string;
    value: number;
    createdAt: Date;
}

class DeviceLog extends Model<DeviceLogAttrs> implements DeviceLogAttrs {
    public id!: string;
    public deviceAttrId!: string;
    public value!: number;
    public createdAt!: Date;
}

DeviceLog.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        deviceAttrId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "DeviceAttributes",
                key: "id",
            },
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "DeviceLogs",
        timestamps: false, 
    }
);

export default DeviceLog;
