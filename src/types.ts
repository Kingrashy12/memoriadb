type SchemaType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor
  | never[]
  | string
  | number;

export type ModelSchema<T extends Record<string, any>> = {
  /**
   * Name of the collection where the model's data is stored.
   */
  collection: string;

  /**
   * Field definitions, where keys are field names and values are types.
   */
  fields: {
    [K in keyof T]: SchemaType;
  };

  /**
   * Required fields that must be provided when creating an instance.
   */
  required?: Array<keyof T>;

  /**
   * Unique fields that should not have duplicate values in the collection.
   */
  unique?: Array<keyof T>;
};

export type ModelData<T extends Record<string, any>> = Partial<T>;

export type FindOneParams = {
  field: string;
  value: string;
};

export interface ModelInterface<T extends Record<string, any>> {
  /**
   * Static method to find all records.
   */
  find(): Promise<T[]>;

  /**
   * Static method to find a record by its ID.
   */
  findById(id: string): Promise<T | null>;

  /**
   * Static method to find a single record by field and value.
   */
  findOne(params: FindOneParams): Promise<T | null>;

  /**
   * Static method to update a record by ID.
   */
  updateById(id: string, updateData: Partial<T>): Promise<T>;

  /**
   * Static method to delete a record by ID.
   */
  deleteById(id: string): Promise<boolean>;
}

export type FindOptions<T> = {
  $and?: Partial<T>[];
  $where?: Partial<T>;
};

export type ModelClass<T> = {
  new (data: Partial<T>): T;
  find(options?: FindOptions<T>): Promise<T[]>;
  findById(id: string): Promise<T>;
  findOne(params: { field: keyof T; value: string }): Promise<T>;
  updateById(id: string, updateData: Partial<T>): Promise<T>;
  deleteById(id: string): Promise<T>;
};

export type Data<T> = {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
} & { [K in keyof T]: T[K] };
