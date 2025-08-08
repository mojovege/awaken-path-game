import React, { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  audioType: 'zen' | 'rhythm' | 'meditation' | 'fire';
  isPlaying: boolean;
  volume?: number;
}

export default function BackgroundMusic({ audioType, isPlaying, volume = 0.3 }: BackgroundMusicProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (isPlaying) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    return () => stopBackgroundMusic();
  }, [isPlaying, audioType]);

  const startBackgroundMusic = () => {
    try {
      stopBackgroundMusic(); // 確保清理舊的音效
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 根據音效類型設定不同參數
      switch (audioType) {
        case 'zen':
          // 禪風音樂：低頻、柔和
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
          break;
        case 'meditation':
          // 冥想音樂：更低頻、持續
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
          oscillator.type = 'triangle';
          gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
          break;
        case 'rhythm':
          // 節奏音樂：不需要背景音樂，只要節拍音效
          return;
        case 'fire':
          // 火焰音效：白噪音效果
          oscillator.frequency.setValueAtTime(4000, audioContext.currentTime);
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime);
          break;
      }
      
      oscillator.start();
      
      audioContextRef.current = audioContext;
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const stopBackgroundMusic = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (error) {
        // 忽略已經停止的錯誤
      }
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    gainNodeRef.current = null;
  };

  // 這個組件不渲染任何可見內容
  return null;
}