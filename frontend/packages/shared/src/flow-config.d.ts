import { z } from 'zod';
export declare const FlowConfigSchema: z.ZodObject<{
    flowId: z.ZodString;
    languages: z.ZodArray<z.ZodString, "many">;
    slots: z.ZodArray<z.ZodString, "many">;
    disclosureScript: z.ZodString;
    handoffTriggers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["slot_mentioned", "disposition", "intent"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "disposition" | "slot_mentioned" | "intent";
        value: string;
    }, {
        type: "disposition" | "slot_mentioned" | "intent";
        value: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    slots: string[];
    flowId: string;
    languages: string[];
    disclosureScript: string;
    handoffTriggers?: {
        type: "disposition" | "slot_mentioned" | "intent";
        value: string;
    }[] | undefined;
}, {
    slots: string[];
    flowId: string;
    languages: string[];
    disclosureScript: string;
    handoffTriggers?: {
        type: "disposition" | "slot_mentioned" | "intent";
        value: string;
    }[] | undefined;
}>;
export type FlowConfig = z.infer<typeof FlowConfigSchema>;
export declare const LeadWebhookSchema: z.ZodObject<{
    crmLeadId: z.ZodString;
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    courseInterest: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    campaignId: z.ZodOptional<z.ZodString>;
    inquiryAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    crmLeadId: string;
    phone: string;
    email?: string | undefined;
    campaignId?: string | undefined;
    courseInterest?: string | undefined;
    source?: string | undefined;
    inquiryAt?: string | undefined;
}, {
    name: string;
    crmLeadId: string;
    phone: string;
    email?: string | undefined;
    campaignId?: string | undefined;
    courseInterest?: string | undefined;
    source?: string | undefined;
    inquiryAt?: string | undefined;
}>;
export type LeadWebhookPayload = z.infer<typeof LeadWebhookSchema>;
//# sourceMappingURL=flow-config.d.ts.map