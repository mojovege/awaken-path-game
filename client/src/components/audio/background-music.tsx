import React, { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  audioType: 'zen' | 'rhythm' | 'meditation' | 'fire';
  isPlaying: boolean;
  volume?: number;
}

export default function BackgroundMusic({ audioType, isPlaying, volume = 0.1 }: BackgroundMusicProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // 清理之前的音效
    cleanup();
    
    if (isPlaying && audioType !== 'rhythm') {
      // 延遲啟動，避免用戶交互前啟動音效
      const timer = setTimeout(() => {
        initializeAudio();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        cleanup();
      };
    }
    
    return cleanup;
  }, [isPlaying, audioType]);

  const initializeAudio = async () => {
    if (isInitialized.current) return;
    
    try {
      // 檢查瀏覽器支持
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        console.log('Web Audio API not supported');
        return;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // 檢查音頻上下文狀態
      if (audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
        } catch (error) {
          console.log('Cannot resume audio context');
          return;
        }
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 根據音效類型設定參數
      let frequency = 220;
      let type: OscillatorType = 'sine';
      let gain = volume * 0.3;
      
      switch (audioType) {
        case 'zen':
          frequency = 220;
          type = 'sine';
          gain = volume * 0.2;
          break;
        case 'meditation':
          frequency = 110;
          type = 'triangle';
          gain = volume * 0.15;
          break;
        case 'fire':
          frequency = 200;
          type = 'sawtooth';
          gain = volume * 0.1;
          break;
        default:
          return; // 不支持的類型
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      // 平滑音量變化
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain, audioContext.currentTime + 1);
      
      oscillator.start();
      
      audioContextRef.current = audioContext;
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      isInitialized.current = true;
      
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  };

  const cleanup = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        // 平滑淡出
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      }
      
      setTimeout(() => {
        if (oscillatorRef.current) {
          try {
            oscillatorRef.current.stop();
          } catch (error) {
            // 忽略已停止的振盪器錯誤
          }
        }
        
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
          } catch (error) {
            // 忽略上下文關閉錯誤
          }
        }
        
        audioContextRef.current = null;
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        isInitialized.current = false;
      }, 600);
      
    } catch (error) {
      console.log('Audio cleanup error:', error);
    }
  };

  return null;
}