import { DataTypes, Model } from "sequelize";
import sequelize from "./database";
import DeviceRepository from "../repository/DeviceRepository";
import DeviceAttribute from "./DeviceAttribute.model";
import { deviceLogService, mqttService, notificationService, systemRuleService } from "../config/container";
import { isRuleSatisfied } from "../utils/ruleValidate";
import SystemRule from "./SystemRule.model";
import Action from "./Action.model";
import logger from "../logger/logger";
import { generateUUID } from "../utils/idGenerator";
import { generateNotificationData } from "../utils/notification-generation";
import { sendWebSocketNotification } from "../service/web-socket.service";

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
            const attr = this.containsFeed(feed); // find the target attribute
            // check if the attribute is found
            if (attr) {
                // check if the value is different or this attribute is a publisher
                if (attr.isPublisher || attr.value !== formattedValue) {
                    attr.value = formattedValue; // update the value in memory
                    await attr.updateStatus(value); // update with new value in database
                    // create log
                    await deviceLogService.addDeviceLog({
                        deviceAttrId: attr.id,
                        value: formattedValue,
                    });
                    // find system rules that connected to this status
                    const rule = await systemRuleService.findRuleOfAttr({
                        deviceAttrId: attr.id,
                        value: formattedValue,
                    });
                    if (rule) {
                        // console.log("rules", rules);
                        logger.info("Found rule" + rule?.toJSON());
                        let actions = rule.actions;
                        if (actions) {
                            const isSatisfied = isRuleSatisfied(rule, formattedValue);
                            // logger.info(isSatisfied);
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
                                // if user choose to receive notification then send it
                                if (rule.receiveNotification) {
                                    await notificationService.createNotification(
                                        generateNotificationData(rule, actions)
                                    );
                                }
                                await Promise.all(promises);
                            }
                        }
                    }
                } else {
                    logger.info("Same value, no update to database");
                }
            } else {
                logger.warn(`Attr with feed ${feed} not found`);
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
