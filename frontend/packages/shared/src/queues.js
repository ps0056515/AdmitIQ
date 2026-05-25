"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_NAMES = exports.QUEUE_NAMES = void 0;
exports.QUEUE_NAMES = {
    LEADS: 'leads',
    CALLS: 'calls',
    CRM_WRITEBACK: 'crm-writeback',
    NOTIFICATIONS: 'notifications',
};
exports.JOB_NAMES = {
    LEAD_INGESTED: 'lead.ingested',
    SCHEDULE_CALL: 'call.schedule',
    PLACE_CALL: 'call.place',
    RETRY_CALL: 'call.retry',
    CRM_WRITEBACK: 'crm.writeback',
    SEND_NOTIFICATION: 'notification.send',
};
//# sourceMappingURL=queues.js.map