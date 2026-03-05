import { z } from 'zod';
import { 
  insertUserSchema, 
  insertAppointmentSchema, 
  insertTaskSchema,
  users,
  appointments,
  tasks,
  waitlistStatus,
  medicalResults,
  resources
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  user: {
    get: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/user' as const,
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    },
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments' as const,
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect>()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
      },
    },
  },
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks' as const,
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect>()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tasks/:id' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
      },
    },
  },
  waitlist: {
    get: {
      method: 'GET' as const,
      path: '/api/waitlist' as const,
      responses: {
        200: z.custom<typeof waitlistStatus.$inferSelect>(),
      },
    },
  },
  results: {
    list: {
      method: 'GET' as const,
      path: '/api/results' as const,
      responses: {
        200: z.array(z.custom<typeof medicalResults.$inferSelect>()),
      },
    },
  },
  resources: {
    list: {
      method: 'GET' as const,
      path: '/api/resources' as const,
      responses: {
        200: z.array(z.custom<typeof resources.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
