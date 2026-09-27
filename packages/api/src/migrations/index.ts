/**
 * Aggregates all database migration classes into a single array for TypeORM.
 */
import { CreateTaskTable1757616723274 } from './1757616723274-CreateTaskTable.js';
import { CreateUserTable1757616900000 } from './1757616900000-CreateUserTable.js';
import { CreateTaskPriorityTable1760869368144 } from './1760869368144-CreateTaskPriorityTable.js';
import { SeedTaskPriorityData1760869380977 } from './1760869380977-SeedTaskPriorityData.js';
import { AddUserIdToTask1760869400000 } from './1760869400000-AddUserIdToTask.js';
import { AddTaskPriorityCodeToTask1761994740000 } from './1761994740000-AddTaskPriorityCodeToTask.js';

/**
 * Exported array of all migrations. Import this array in your TypeORM configuration.
 */
export const migrations = [
  CreateTaskTable1757616723274,
  CreateUserTable1757616900000,
  CreateTaskPriorityTable1760869368144,
  SeedTaskPriorityData1760869380977,
  AddUserIdToTask1760869400000,
  AddTaskPriorityCodeToTask1761994740000,
];
