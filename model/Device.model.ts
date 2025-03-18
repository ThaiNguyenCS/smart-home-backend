import { DataTypes, Model } from "sequelize";
import sequelize from "./database";
import DeviceRepository from "../repository/DeviceRepository";
import DeviceAttribute from "./DeviceAttribute.model";
import { mqttService, systemRuleService } from "../config/container";
import { isRuleSatisfied } from "../utils/ruleValidate";
import SystemRule from "./SystemRule.model";
import Action from "./Action.model";

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
        const formattedValue = parseFloat(value);
        try {
            if (isNaN(formattedValue)) {
                throw new Error(`${value} is not a valid value`);
            }
            const attr = this.containsFeed(feed); // find the targer attribute

            if (attr) {
                await attr.updateStatus(value);
                //TODO: find system rules that connected to this status
                const rule = await systemRuleService.findRuleOfAttr({ deviceAttrId: attr.id, value: formattedValue });
                // const rule = await SystemRule.findOne({
                //     where: {
                //         deviceAttrId: attr.id,
                //         value: parseFloat(value),
                //         isActive: true,
                //     },
                //     include: [
                //         { model: DeviceAttribute, as: "deviceAttribute", required: true },
                //         {
                //             model: Action,
                //             as: "actions",
                //             required: false,
                //             include: [{ model: DeviceAttribute, as: "deviceAttribute", required: true }],
                //         },
                //     ],
                // });
                if (rule) {
                    // console.log("rules", rules);
                    console.log("Found rule" + rule?.toJSON());
                    let actions = rule.actions;
                    if (actions) {
                        const isSatisfied = isRuleSatisfied(rule, value);
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
