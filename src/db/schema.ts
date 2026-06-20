import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'cvs' table with a foreign key to 'users'.
export const cvs = pgTable('cvs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(), // JSON representation of the CV
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'payments' table for registering payment submissions
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id),
  email: text('email').notNull(),
  txId: text('tx_id').notNull().unique(),
  amount: integer('amount').notNull(),
  plan: text('plan').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table.
export const usersRelations = relations(users, ({ many }) => ({
  cvs: many(cvs),
  payments: many(payments),
}));

// Define relationships for the 'cvs' table.
export const cvsRelations = relations(cvs, ({ one }) => ({
  author: one(users, {
    fields: [cvs.userId],
    references: [users.id],
  }),
}));

// Define relationships for the 'payments' table.
export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));
