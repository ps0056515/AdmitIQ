-- Flyway Migration V1: Initial Schema Setup

-- 1. Tenants Table
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ONBOARDING',
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'LITE',
    calling_window_start VARCHAR(10) NOT NULL DEFAULT '09:00',
    calling_window_end VARCHAR(10) NOT NULL DEFAULT '21:00',
    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
    max_concurrent_calls INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- 3. Campaigns Table
CREATE TABLE campaigns (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) REFERENCES tenants(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    flow_config JSONB NOT NULL,
    caller_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_campaigns_tenant_id ON campaigns(tenant_id);

-- 4. CRM Connections Table
CREATE TABLE crm_connections (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) REFERENCES tenants(id) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    credentials JSONB NOT NULL,
    field_mapping JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_crm_connections_tenant_id ON crm_connections(tenant_id);

-- 5. Leads Table
CREATE TABLE leads (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) REFERENCES tenants(id) NOT NULL,
    campaign_id VARCHAR(36) REFERENCES campaigns(id),
    crm_lead_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    phone_e164 VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    course_interest VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    inquiry_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dedup_key VARCHAR(255) NOT NULL,
    assigned_to_id VARCHAR(36) REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, dedup_key)
);
CREATE INDEX idx_leads_tenant_status ON leads(tenant_id, status);
CREATE INDEX idx_leads_tenant_phone ON leads(tenant_id, phone_e164);

-- 6. Call Sessions Table
CREATE TABLE call_sessions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) REFERENCES tenants(id) NOT NULL,
    lead_id VARCHAR(36) REFERENCES leads(id) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'INITIATED',
    provider_call_id VARCHAR(100),
    disposition VARCHAR(50),
    lead_score VARCHAR(50),
    confidence DOUBLE PRECISION,
    language_detected VARCHAR(50),
    transcript_url VARCHAR(500),
    recording_url VARCHAR(500),
    slots JSONB,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_call_sessions_tenant_created ON call_sessions(tenant_id, created_at);
CREATE INDEX idx_call_sessions_lead_id ON call_sessions(lead_id);

-- 7. Transcript Turns Table
CREATE TABLE transcript_turns (
    id VARCHAR(36) PRIMARY KEY,
    call_session_id VARCHAR(36) REFERENCES call_sessions(id) ON DELETE CASCADE NOT NULL,
    speaker VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    timestamp_ms INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transcript_turns_call_session ON transcript_turns(call_session_id);

-- 8. Counsellor Assignments Table
CREATE TABLE counsellor_assignments (
    id VARCHAR(36) PRIMARY KEY,
    lead_id VARCHAR(36) REFERENCES leads(id) NOT NULL,
    counsellor_id VARCHAR(36) REFERENCES users(id) NOT NULL,
    callback_scheduled_at TIMESTAMP,
    is_overdue BOOLEAN NOT NULL DEFAULT FALSE,
    context_package JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_counsellor_assignments_counsellor ON counsellor_assignments(counsellor_id);

-- 9. Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    actor_id VARCHAR(36),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(36),
    outcome VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    before_json JSONB,
    after_json JSONB,
    reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
