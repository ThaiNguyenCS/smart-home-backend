import { DataTypes, Model } from "sequelize";
import sequelize from "./database";
import DeviceRepository from "../repository/DeviceRepository";
import DeviceAttribute from "./DeviceAttribute.model";
import { mqttService, systemRuleService } from "../config/container";
import { isRuleSatisfied } from "../utils/ruleValidate";

interface DeviceAttrs {
    id: string;
    userId: string;
    roomId?: string | null;
    name: string;
    attributes?: DeviceAttribute[];
}

class Device extends Model<DeviceAttrs> implements DeviceAttrs {
    public id!: string;
    public roomId!: string | null;
    public name!: string;
    public attributes?: DeviceAttribute[];
    public userId!: string;

    // public async loadDeviceAttrs() {
    //     const attrs = await this.deviceRepository.getDeviceAttr({ deviceId: this.id });
    //     this.attributes = attrs;
    // }

    public containsFeed(feed: string) {
        // console.log(this.attributes);
        if (this.attributes) return this.attributes.find((attr) => attr.feed === feed);
    }

    public async updateDeviceStatus(data: any) {
        const { feed, value } = data;
        const attr = this.containsFeed(feed);
        // console.log(this.name);
        // console.log(this.attributes);
        try {
            if (attr) {
                await attr.updateStatus(value);
                //TODO: find system rules that connected to this status
                const rules = await systemRuleService.findRuleOfAttr({ deviceAttrId: attr.id });
                if (rules) {
                    // console.log("rules", rules);
                    let actions = rules.actions;
                    if (actions) {
                        const isSatisfied = isRuleSatisfied(rules, value);
                        if (isSatisfied) {
                            let promises = [];
                            for (let i = 0; i < actions.length; i++) {
                                // console.log(actions[i]);
                                let deviceAttr = actions[i].deviceAttribute;

                                if (deviceAttr) {
                                    promises.push(mqttService.publishMessage(deviceAttr.feed, actions[i].value));
                                } else {
                                    console.error("Action does not have corresponding deviceAttribute");
                                }
                            }
                            await Promise.all(promises);
                        }
                    }
                }
            } else {
                console.log(`Attr with feed ${feed} not found`);
            }
        } catch (error) {
            console.error(error);
        }
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
        userId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Users",
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
