export class EventService {
  private currentEvent: any = null;
  private eventHistory: any[] = [];

  triggerEvent(type: string, data: any) {
    // Create event
    const event = {
      id: `${type}-${Date.now()}`,
      type,
      ...data,
      timestamp: new Date()
    };

    // Store current event
    this.currentEvent = event;
    
    // Add to history if choice was made
    if (data.choiceMade) {
      this.eventHistory.push(event);
    }

    return {
      success: true,
      event
    };
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  getEventHistory() {
    return [...this.eventHistory];
  }
}