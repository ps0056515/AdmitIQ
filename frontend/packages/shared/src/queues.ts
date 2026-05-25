export const QUEUE_NAMES = {
  LEADS: 'leads',
  CALLS: 'calls',
  CRM_WRITEBACK: 'crm-writeback',
  NOTIFICATIONS: 'notifications',
} as const;

export const JOB_NAMES = {
  LEAD_INGESTED: 'lead.ingested',
  SCHEDULE_CALL: 'call.schedule',
  PLACE_CALL: 'call.place',
  RETRY_CALL: 'call.retry',
  CRM_WRITEBACK: 'crm.writeback',
  SEND_NOTIFICATION: 'notification.send',
} as const;

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
