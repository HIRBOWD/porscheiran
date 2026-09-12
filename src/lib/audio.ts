"use client";

class SoundManager {
  private isMuted: boolean = true;

  public toggleMute(): boolean {
    return true;
  }

  public getIsMuted(): boolean {
    return true;
  }

  /**
   * Sound disabled
   */
  public playClick() {
    // Audio permanently disabled across site
  }

  /**
   * Sound disabled
   */
  public playEngineRev(_modelType?: "macan" | "boxster" | "911" | "gt3") {
    // Audio permanently disabled across site
  }
}

export const soundManager = new SoundManager();
