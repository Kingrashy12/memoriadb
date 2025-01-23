# MemoriaDB

MemoriaDB is a lightweight, in-memory database library for Node.js, designed for simplicity and ease of use. It provides basic CRUD operations, schema validation, and unique constraints, making it ideal for prototyping, testing, or small-scale applications.

## Features

- **In-Memory Storage**: Data is stored in memory, making it fast and lightweight.
- **Schema Validation**: Define schemas with fields, required fields, and unique constraints.
- **CRUD Operations**: Create, Read, Update, and Delete records with ease.
- **TypeScript Support**: Built with TypeScript for type safety and better developer experience.
- **Simple API**: Easy-to-use API for managing collections and records.

## Installation

You can install `memoriadb` via npm:

```bash
npm install memoriadb
```

Or using yarn:

```bash
yarn add memoriadb
```

### Usage

#### Defining a Schema

```ts
import { Schema } from "memoriadb";

const User = Schema({
  fields: {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  },
  required: ["email", "password"],
  unique: ["email"],
  collection: "User",
});
```

### Creating a Record

You can create a new record using the schema:

```ts
const newUser = new User({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "securepassword123",
});
```

### Finding Records

Retrieve records using the static methods provided by the schema:

```ts
// Find all users
const allUsers = await User.find();

// Find a user by ID
const userById = await User.findById("97264891993");

// Find a user by a specific field
const userByEmail = await User.findOne({
  field: "email",
  value: "john.doe@example.com",
});
```

### Updating a Record

Update a record by its ID:

```ts
const updatedUser = await User.updateById("97264891993", {
  firstName: "Jane",
});
```

### Deleting a Record

Delete a record by its ID:

```ts
await User.deleteById("123");
```

### Contributing

Contributions are welcome! If you'd like to contribute to MemoriaDB, please follow these steps:

1.  Fork the repository.

2.  Create a new branch for your feature or bugfix.

3.  Commit your changes.

4.  Submit a pull request.

### License

MemoriaDB is open-source software licensed under the [MIT License](./LICENCE).
