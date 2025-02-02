import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const genId = () => {
  const nums = "1234567890";
  let id = "";
  for (let i = 0; i < 11; i++) {
    id += Math.floor(Math.random() * nums.length);
  }
  return id;
};

type Where<T> = {
  field: T;
  value: unknown;
};

class WriteToDB {
  private entryPoint = "db";
  private name = "";
  private dir = "";
  constructor(collection_name: string) {
    this.name = collection_name;
    this.dir = path.join(process.cwd(), `${this.entryPoint}/${this.name}.json`);
  }

  create(name: string) {
    if (!name) {
      throw new Error("Please set your collection name");
    }

    const createDir = () => {
      mkdirSync(this.entryPoint, { recursive: true });
      console.log(`Collection ${name} created`);
    };

    const createFile = (extraAction?: () => void) => {
      try {
        if (extraAction) {
          extraAction();
          writeFileSync(this.dir, JSON.stringify([]));
        }
      } catch (error) {
        throw new Error(`Something went wrong: ${error}`);
      }
    };

    if (existsSync(this.dir)) {
      return;
    } else {
      createFile(createDir);
    }
  }

  set(data: unknown) {
    if (typeof data !== "object") {
      throw new Error("Invalid data type, it should be an object");
    }

    let currentData = [];
    try {
      const dataInset = readFileSync(this.dir, "utf-8");
      currentData = JSON.parse(dataInset);
    } catch (error) {
      throw new Error(
        `Error reading data from ${this.name} collection: ${error}`
      );
    }

    const dataObj = {
      id: genId(),
      ...data,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    currentData.push(dataObj); // Add new data to the array

    try {
      // Write back the updated data to file
      writeFileSync(this.dir, JSON.stringify(currentData, null, 2));
      console.log("Data added successfully");
      return dataObj;
    } catch (error) {
      throw new Error(
        `Error writing data to ${this.name} collection: ${error}`
      );
    }
  }

  get() {
    try {
      const data = readFileSync(this.dir, "utf-8");
      return JSON.parse(data); // Return the parsed JSON data
    } catch (error) {
      throw new Error(
        `Error reading data from ${this.name} collection: ${error}`
      );
    }
  }

  update<T>(id: string, updateData: T) {
    try {
      const data = readFileSync(this.dir, "utf-8");
      const currentData = JSON.parse(data);

      const index = currentData.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        currentData[index] = {
          ...currentData[index],
          updated_at: Date.now(),
          ...updateData,
        };
        writeFileSync(this.dir, JSON.stringify(currentData, null, 2));
        const current = currentData.find((item: any) => item.id === id);
        if (current) console.log("Data updated successfully");
        return current;
      } else {
        console.log("No matching record found for update");
      }
    } catch (error) {
      throw new Error(
        `Error updating data in ${this.name} collection: ${error}`
      );
    }
  }

  delete(id: string) {
    try {
      const data = readFileSync(this.dir, "utf-8");
      const currentData = JSON.parse(data);

      const filteredData = currentData.filter((item: any) => item.id !== id);

      const deletedItem = currentData.find((item: any) => item.id === id);
      writeFileSync(this.dir, JSON.stringify(filteredData, null, 2));
      if (deletedItem) console.log("Data deleted successfully");
      return deletedItem;
    } catch (error) {
      console.error("Error deleting data from DB", error);
    }
  }

  findOne<T>(query: Where<T>) {
    const data = this.get();
    const filteredData = data.find(
      (item: any) => item[query.field] === query.value
    );
    return filteredData;
  }
}

export default WriteToDB;
