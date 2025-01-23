import { Data, ModelClass, ModelInterface, ModelSchema } from "./types";
import WriteToDB from "./write_to_db";

/**
 * Creates a schema model with basic CRUD operations and validation.
 *
 * @template T - The type of the data object defined by the schema.
 * @param {ModelSchema<T>} definition - An object defining schema fields, unique constraints, required fields, and collection name.
 * @returns {ModelClass<T>} - A class representing the schema model with CRUD methods.
 */
function Schema<T>(definition: ModelSchema<T>) {
  class Model {
    private data: Partial<Data<T>>;
    public static writeTodbInstance: WriteToDB;

    constructor(data: Partial<T>) {
      this.data = data;

      if (definition.required) {
        const missingFields = definition.required.filter(
          (field) =>
            !(field in data && data[field] !== undefined && data[field] !== "")
        );
        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields: ${missingFields.join(", ")}`
          );
        }
      }

      this.checkForUndefinedField();

      if (!definition.collection) {
        throw new Error("Please add your collection name");
      }

      if (!Model.writeTodbInstance) {
        Model.writeTodbInstance = new WriteToDB(definition.collection);
        Model.writeTodbInstance.create(definition.collection);
      }

      this.checkUniqueKey();
      return Model.writeTodbInstance.set(this.data) as any;
    }

    get(key: keyof T): T[keyof T] | undefined {
      return this.data[key];
    }

    private checkForUndefinedField() {
      const allowedFields = Object.keys(definition.fields);
      const inputFields = Object.keys(this.data);

      const undefinedFields = inputFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (undefinedFields.length > 0) {
        throw new Error(
          `Undefined fields detected: ${undefinedFields.join(", ")}`
        );
      }
    }

    private checkUniqueKey() {
      const datas = Model.writeTodbInstance.get();

      for (const item of datas) {
        let uniqueKeyFound;
        let duplicateValue;

        const isUnique = definition.unique?.some((uniqueKey) => {
          const incomingValue = this.data[uniqueKey];
          const existingValue = item[uniqueKey];

          if (existingValue !== undefined && existingValue === incomingValue) {
            uniqueKeyFound = uniqueKey;
            duplicateValue = existingValue;
            return true;
          }
          return false;
        });

        if (isUnique) {
          throw new Error(
            `A value with the unique key '${uniqueKeyFound}' and value '${duplicateValue}' already exists in the collection.`
          );
        }
      }
    }

    private static getCheckInputFields(data: Partial<T>) {
      const allowedFields = Object.keys(definition.fields);
      const inputFields = Object.keys(data);

      const undefinedFields = inputFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (undefinedFields.length > 0) {
        throw new Error(
          `Undefined fields detected: ${undefinedFields.join(", ")}`
        );
      }
    }

    private static getWriteToDB(): WriteToDB {
      if (!Model.writeTodbInstance) {
        Model.writeTodbInstance = new WriteToDB(definition.collection);
      }
      return Model.writeTodbInstance;
    }

    static async find(): Promise<T[]> {
      return this.getWriteToDB().get();
    }

    static async findById(id: string): Promise<T> {
      return this.getWriteToDB().findOne({ field: "id", value: id });
    }

    static async findOne({
      field,
      value,
    }: {
      field: string;
      value: string;
    }): Promise<any> {
      return this.getWriteToDB().findOne({ field, value });
    }

    static async updateById(id: string, updateData: Partial<T>): Promise<any> {
      this.getCheckInputFields(updateData);
      return this.getWriteToDB().update(id, updateData);
    }

    static async deleteById(id: string): Promise<any> {
      return this.getWriteToDB().delete(id);
    }
  }

  return Model as unknown as ModelClass<Data<T>>;
}

export default Schema;
