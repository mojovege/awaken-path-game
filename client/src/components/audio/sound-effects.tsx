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
            // 佛教木魚聲：短促清脆
            frequency = 1000;
            oscillatorType = 'sine';
            duration = 0.1;
            gain = 0.2;
            
            // 添加諧波，模擬木魚的敲擊聲
            const harmonicOsc = this.audioContext.createOscillator();
            const harmonicGain = this.audioContext.createGain();
            harmonicOsc.connect(harmonicGain);
            harmonicGain.connect(this.audioContext.destination);
            
            harmonicOsc.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
            harmonicOsc.type = 'triangle';
            harmonicGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            harmonicGain.gain.linearRampToValueAtTime(gain * 0.3, this.audioContext.currentTime + 0.01);
            harmonicGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration * 0.5);
            
            harmonicOsc.start(this.audioContext.currentTime);
            harmonicOsc.stop(this.audioContext.currentTime + duration * 0.5);
            
          } else if (religion === 'taoism') {
            // 道教鼓聲：低沉有力
            frequency = 120;
            oscillatorType = 'triangle';
            duration = 0.3;
            gain = 0.25;
            
            // 添加噪音元素，模擬鼓聲
            const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < output.length; i++) {
              output[i] = (Math.random() * 2 - 1) * 0.1;
            }
            
            const noiseNode = this.audioContext.createBufferSource();
            const noiseGain = this.audioContext.createGain();
            noiseNode.buffer = noiseBuffer;
            noiseNode.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);
            
            noiseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            noiseNode.start(this.audioContext.currentTime);
            
          } else { // mazu
            // 媽祖海浪聲：流動溫和
            frequency = 200;
            oscillatorType = 'sine';
            duration = 0.4;
            gain = 0.15;
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
      
      // 設定振盪器基本屬性
      oscillator.type = oscillatorType;
      
      // 根據音效類型設定頻率
      if (type === 'beat') {
        if (religion === 'mazu') {
          // 媽祖海浪聲：添加頻率調制
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(frequency * 1.5, this.audioContext.currentTime + duration * 0.3);
          oscillator.frequency.linearRampToValueAtTime(frequency * 0.8, this.audioContext.currentTime + duration);
        } else {
          // 佛教和道教節拍
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        }
      } else {
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      }
      
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