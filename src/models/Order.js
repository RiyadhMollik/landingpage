'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customerAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    customerMobile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'eps'
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    merchantTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    gatewayTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'eps'
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    orderStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    }
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Order.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return Order;
};