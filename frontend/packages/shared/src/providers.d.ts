export interface OutboundCallParams {
    to: string;
    from: string;
    tenantId: string;
    callSessionId: string;
}
export interface CallHandle {
    providerCallId: string;
}
export interface AudioFrame {
    data: Buffer;
    timestampMs: number;
}
export interface TelephonyEvent {
    type: 'ringing' | 'answered' | 'hangup' | 'busy' | 'no_answer' | 'failed';
    reason?: string;
}
export interface STTConfig {
    language: string;
    sampleRate: number;
}
export interface STTSession {
    writeAudio(chunk: AudioFrame): void;
    onTranscript: AsyncIterable<{
        text: string;
        isFinal: boolean;
    }>;
    close(): Promise<void>;
}
export interface VoiceConfig {
    personaId: string;
    language: string;
}
export interface AudioChunk {
    data: Buffer;
}
export interface CompletionParams {
    systemPrompt: string;
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    temperature?: number;
}
export interface CompletionResult {
    content: string;
    confidence?: number;
}
export interface TokenChunk {
    token: string;
}
export interface TelephonyProvider {
    initiateOutboundCall(params: OutboundCallParams): Promise<CallHandle>;
    hangup(callId: string): Promise<void>;
    mediaStream(callId: string): AsyncIterable<AudioFrame>;
    signalingEvents(callId: string): AsyncIterable<TelephonyEvent>;
}
export interface SpeechToTextProvider {
    createStreamingSession(config: STTConfig): STTSession;
}
export interface TextToSpeechProvider {
    synthesizeStream(text: string, voice: VoiceConfig): AsyncIterable<AudioChunk>;
}
export interface LLMProvider {
    complete(params: CompletionParams): Promise<CompletionResult>;
    stream(params: CompletionParams): AsyncIterable<TokenChunk>;
}
//# sourceMappingURL=providers.d.ts.map