// 音效工具類
export class SoundEffects {
  private static audioContext: AudioContext | null = null;
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized && this.audioContext) {
      console.log('音效系統已初始化');
      return true;
    }
    
    try {
      console.log('開始初始化音效系統...');
      
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        console.error('瀏覽器不支持 Web Audio API');
        return false;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      console.log('AudioContext 創建完成，狀態:', this.audioContext.state);
      
      if (this.audioContext.state === 'suspended') {
        console.log('嘗試恢復 AudioContext...');
        await this.audioContext.resume();
        console.log('AudioContext 恢復後狀態:', this.audioContext.state);
      }
      
      this.isInitialized = true;
      console.log('音效系統初始化成功');
      return true;
    } catch (error) {
      console.error('音效系統初始化失敗:', error);
      return false;
    }
  }

  static async playSound(type: 'beat' | 'fire' | 'success' | 'error', religion?: string) {
    console.log('🔊 播放音效請求:', type, '宗教:', religion);
    
    try {
      const initialized = await this.initialize();
      if (!initialized || !this.audioContext) {
        console.error('❌ 音效系統初始化失敗，無法播放音效');
        return false;
      }
      
      if (this.audioContext.state !== 'running') {
        console.log('⚠️ AudioContext 不在運行狀態:', this.audioContext.state);
        if (this.audioContext.state === 'suspended') {
          try {
            await this.audioContext.resume();
            console.log('✅ AudioContext 已恢復運行');
          } catch (resumeError) {
            console.error('❌ 無法恢復 AudioContext:', resumeError);
            return false;
          }
        }
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
      
      const startTime = this.audioContext.currentTime;
      const stopTime = startTime + duration;
      
      oscillator.start(startTime);
      oscillator.stop(stopTime);
      
      console.log('🎵 音效播放開始:', {
        type,
        religion,
        frequency: frequency + 'Hz',
        duration: duration + 's',
        oscillatorType,
        gain
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ 音效播放失敗:', error);
      return false;
    }
  }
  
  // 測試音效系統是否正常工作
  static async testAudio() {
    console.log('🧪 開始音效系統測試...');
    
    const initialized = await this.initialize();
    if (!initialized) {
      console.error('❌ 音效系統測試失敗：初始化失敗');
      return false;
    }
    
    console.log('✅ 音效系統測試通過');
    return true;
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