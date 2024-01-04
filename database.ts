import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("tasks.db");

// Create table if not exists
const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contactNumber TEXT NOT NULL,
        city TEXT,
        state TEXT,
        targetCallCount INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS call_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME,
    task_id INTEGER,
    call_type TEXT,
    duration INTEGER
  );`,
    );
  });
};

// Insert mock data
const insertMockData = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO tasks (name, contactNumber, city, state, targetCallCount) VALUES (?, ?, ?, ?, ?)",
      ["John Doe", "1234567890", "City", "State", 5],
    );
    // Add more insert statements as needed
  });
};

// Fetch tasks from the database
const fetchTasks = (callback: (tasks: Task[]) => void) => {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM tasks", [], (_, { rows }) => {
      const tasks: Task[] = rows["_array"];
      callback(tasks);
    });
  });
};

export { initDatabase, insertMockData, fetchTasks, db };
