const { sequelize } = require("../models");

async function runTransaction(callback: any) {
    const transaction = await sequelize.transaction();
    try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = { runTransaction };
