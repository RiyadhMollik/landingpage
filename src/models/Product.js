'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    campaignEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true
    },
    validity: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Product.associate = function(models) {
    Product.hasMany(models.Order, {
      foreignKey: 'productId',
      as: 'orders'
    });
  };

  return Product;
};