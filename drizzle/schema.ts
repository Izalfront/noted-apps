import { mysqlTable, varchar, int, date } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  firstname: varchar('firstname', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  birthdate: date('birthdate'),
});

export const addresses = mysqlTable('addresses', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').references(() => users.id),
  street: varchar('street', { length: 255 }),
  city: varchar('city', { length: 255 }),
  province: varchar('province', { length: 255 }),
  postal_code: varchar('postal_code', { length: 20 }),
});
