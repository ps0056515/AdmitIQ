export declare const QUEUE_NAMES: {
    readonly LEADS: "leads";
    readonly CALLS: "calls";
    readonly CRM_WRITEBACK: "crm-writeback";
    readonly NOTIFICATIONS: "notifications";
};
export declare const JOB_NAMES: {
    readonly LEAD_INGESTED: "lead.ingested";
    readonly SCHEDULE_CALL: "call.schedule";
    readonly PLACE_CALL: "call.place";
    readonly RETRY_CALL: "call.retry";
    readonly CRM_WRITEBACK: "crm.writeback";
    readonly SEND_NOTIFICATION: "notification.send";
};
export interface LeadIngestedPayload {
    tenantId: string;
    leadId: string;
    campaignId?: string;
}
export interface ScheduleCallPayload {
    tenantId: string;
    leadId: string;
    attempt: number;
}
export interface PlaceCallPayload {
    tenantId: string;
    leadId: string;
    callSessionId: string;
}
export interface CrmWritebackPayload {
    tenantId: string;
    callSessionId: string;
    crmLeadId: string;
}
//# sourceMappingURL=queues.d.ts.map