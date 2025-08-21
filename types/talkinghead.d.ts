declare module '@met4citizen/talkinghead' {
  export class TalkingHead {
    constructor(container: HTMLElement, options?: any)
    
    showAvatar(avatar: any): Promise<void>
    speakText(text: string, options?: any): void
    lookAt(x: number, y: number, t: number): void
    makeEyeContact(t: number): void
    setMood(mood: string): void
    playGesture(name: string, duration?: number, mirror?: boolean, ms?: number): void
    stopGesture(ms?: number): void
    start(): void
    stop(): void
  }
} 