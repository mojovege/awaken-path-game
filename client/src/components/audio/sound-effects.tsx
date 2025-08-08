// 音效工具類
export class SoundEffects {
  private static audioContext: AudioContext | null = null;
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;
    
    try {
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        console.log('Web Audio API not supported');
        return;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  }

  static async playSound(type: 'beat' | 'fire' | 'success' | 'error', religion?: string) {
    console.log('SoundEffects.playSound 被調用:', type, '宗教:', religion);
    try {
      await this.initialize();
      console.log('音效系統初始化完成，準備播放音效');
      
      if (!this.audioContext) {
        console.error('AudioContext 未能初始化');
        return;
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      let frequency = 440;
      let oscillatorType: OscillatorType = 'sine';
      let duration = 0.2;
      let gain = 0.1;
      
      switch (type) {
        case 'beat':
          // 根據宗教設定不同的節拍音效
          if (religion === 'buddhism') {
            frequency = 800; // 高頻率，清脆的木魚聲
            oscillatorType = 'sine';
            duration = 0.15;
            gain = 0.15;
          } else if (religion === 'taoism') {
            frequency = 400; // 中頻率，沉穩的鼓聲
            oscillatorType = 'square';
            duration = 0.2;
            gain = 0.18;
          } else { // mazu
            frequency = 600; // 中高頻率，海浪般的節拍
            oscillatorType = 'triangle';
            duration = 0.18;
            gain = 0.16;
          }
          break;
          
        case 'fire':
          // 點火聲音效
          frequency = 200;
          oscillatorType = 'sawtooth';
          duration = 0.3;
          gain = 0.1;
          
          // 頻率變化模擬火焰聲
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            frequency * 2, 
            this.audioContext.currentTime + duration * 0.5
          );
          break;
          
        case 'success':
          // 成功音效
          frequency = 523; // C5
          oscillatorType = 'sine';
          duration = 0.4;
          gain = 0.2;
          
          // 上升音調
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            frequency * 1.5, 
            this.audioContext.currentTime + duration
          );
          break;
          
        case 'error':
          // 錯誤音效
          frequency = 220; // A3
          oscillatorType = 'square';
          duration = 0.3;
          gain = 0.15;
          break;
      }
      
      if (type !== 'fire' && type !== 'success') {
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      }
      oscillator.type = oscillatorType;
      
      // 音量包絡
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
      console.log('音效播放完成:', type, '頻率:', frequency, '持續時間:', duration);
      
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
  }

  static cleanup() {
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        console.log('Audio context cleanup error:', error);
      }
      this.audioContext = null;
      this.isInitialized = false;
    }
  }
}