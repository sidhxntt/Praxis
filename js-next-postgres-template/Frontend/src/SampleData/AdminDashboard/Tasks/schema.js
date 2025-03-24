import { z } from 'zod'

// Defined enums for status, label, and priority
const taskStatusSchema = z.union([
  z.literal('todo'),
  z.literal('in progress'),
  z.literal('done'),
  z.literal('backlog'),
  z.literal('canceled')
])

const taskLabelSchema = z.union([
  z.literal('bug'),
  z.literal('feature'),
  z.literal('documentation'),
])

const taskPrioritySchema = z.union([
  z.literal('low'),
  z.literal('medium'),
  z.literal('high'),
])

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title cannot be empty"),
  status: taskStatusSchema,
  label: taskLabelSchema,
  priority: taskPrioritySchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

export const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  status: z.string().min(1, "Please select a status."),
  label: z.string().min(1, "Please select a label."),
  priority: z.string().min(1, "Please choose a priority."),
});

export const taskListSchema = z.array(taskSchema)
