"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    // static associate(models) {
    //   // define association here
    // }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      console.log((await Todo.overdue()).map((todo) => todo.displayableString()).join("\n"));
      console.log("\n");
      console.log("Due Today");
      console.log((await Todo.dueToday()).map((todo) => todo.displayableString()).join("\n"));
      console.log("\n");
      console.log("Due Later");
      console.log((await Todo.dueLater()).map((todo) => todo.displayableString()).join("\n"));
    }

    static async overdue() {
      const yesterday = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
      return yesterday;
    }

    static async dueToday() {
      const todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
      return todos;
    }

    static async dueLater() {
      const tomorrow = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
      return tomorrow;
    }

    static async markAsComplete(id) {
      try {
        await Todo.update(
          { completed: true },
          {
            where: {
              id: id,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate == new Date().toLocaleDateString("en-CA") ? "" : this.dueDate}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
