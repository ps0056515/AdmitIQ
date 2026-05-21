"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadWebhookSchema = exports.FlowConfigSchema = void 0;
const zod_1 = require("zod");
exports.FlowConfigSchema = zod_1.z.object({
    flowId: zod_1.z.string(),
    languages: zod_1.z.array(zod_1.z.string()).min(1),
    slots: zod_1.z.array(zod_1.z.string()),
    disclosureScript: zod_1.z.string().min(10),
    handoffTriggers: zod_1.z
        .array(zod_1.z.object({
        type: zod_1.z.enum(['slot_mentioned', 'disposition', 'intent']),
        value: zod_1.z.string(),
    }))
        .optional(),
});
exports.LeadWebhookSchema = zod_1.z.object({
    crmLeadId: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(10),
    email: zod_1.z.string().email().optional(),
    courseInterest: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
    campaignId: zod_1.z.string().optional(),
    inquiryAt: zod_1.z.string().datetime().optional(),
});
//# sourceMappingURL=flow-config.js.map