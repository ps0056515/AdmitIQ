import { z } from 'zod';

export const FlowConfigSchema = z.object({
  flowId: z.string(),
  languages: z.array(z.string()).min(1),
  slots: z.array(z.string()),
  disclosureScript: z.string().min(10),
  handoffTriggers: z
    .array(
      z.object({
        type: z.enum(['slot_mentioned', 'disposition', 'intent']),
        value: z.string(),
      }),
    )
    .optional(),
});

export type FlowConfig = z.infer<typeof FlowConfigSchema>;

export const LeadWebhookSchema = z.object({
  crmLeadId: z.string(),
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  courseInterest: z.string().optional(),
  source: z.string().optional(),
  campaignId: z.string().optional(),
  inquiryAt: z.string().datetime().optional(),
});

export type LeadWebhookPayload = z.infer<typeof LeadWebhookSchema>;
