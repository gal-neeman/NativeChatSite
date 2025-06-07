type EventName = 'message';

export interface EventData<T = unknown> {
    eventName : EventName;
    data : T;
}