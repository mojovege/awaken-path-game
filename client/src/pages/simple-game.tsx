import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';

export default function SimpleGamePage() {
  const { gameType } = useParams<{ gameType: string }>();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showingCards, setShowingCards] = useState(true);
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'memorize' | 'recall' | 'complete'>('memorize');
  const [timeLeft, setTimeLeft] = useState(8);

  // Memory game timer
  useEffect(() => {
    if (gameStarted && gamePhase === 'memorize' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && gamePhase === 'memorize' && timeLeft === 0) {
      setShowingCards(false);
      setGamePhase('recall');
    }
  }, [gameStarted, gamePhase, timeLeft]);

  const startMemoryGame = () => {
    setGameStarted(true);
    setSelectedCards([]);
    setShowingCards(true);
    setScore(0);
    setGamePhase('memorize');
    setTimeLeft(8);
  };

  const handleCardClick = (cardIndex: number) => {
    if (gamePhase !== 'recall') return;
    
    if (selectedCards.includes(cardIndex)) {
      setSelectedCards(selectedCards.filter(i => i !== cardIndex));
    } else {
      const newSelected = [...selectedCards, cardIndex];
      setSelectedCards(newSelected);
      
      // Check if all target cards are selected (first 3 cards)
      if (newSelected.length === 3) {
        const correctCards = [0, 1, 2];
        const isCorrect = correctCards.every(card => newSelected.includes(card));
        
        if (isCorrect) {
          setScore(100);
          setGamePhase('complete');
          setTimeout(() => {
            alert('恭喜！您成功記住了所有建築位置！獲得100分');
          }, 500);
        } else {
          setTimeout(() => {
            alert('請再試一次，記住最初顯示的三個建築位置');
            setSelectedCards([]);
          }, 500);
        }
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9f7f4',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          color: '#8B6914',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          覺悟之路 - 記憶訓練
        </h1>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            遊戲類型：{gameType === 'memory-temple' ? '寺廟導覽記憶' : '經文配對記憶'}
          </p>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '30px' }}>
            專為中高齡使用者設計的認知訓練遊戲
          </p>
        </div>

        {gameType === 'memory-temple' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', color: '#8B6914', marginBottom: '20px' }}>
              佛教寺廟建築記憶
            </h2>
            
            {!gameStarted && (
              <div style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
                  <strong>遊戲規則：</strong>
                </p>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                  1. 點擊「開始遊戲」後，前三個建築會用黃色框標示
                </p>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                  2. 您有8秒時間記住這些建築的位置
                </p>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                  3. 時間到後，點擊您記住的前三個建築位置即可得分
                </p>
              </div>
            )}

            {gameStarted && gamePhase === 'memorize' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '20px', color: '#e74c3c', fontWeight: 'bold' }}>
                  請記住前三個建築的位置！時間：{timeLeft}秒
                </p>
              </div>
            )}

            {gameStarted && gamePhase === 'recall' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '18px', color: '#27ae60', fontWeight: 'bold' }}>
                  現在點擊您記住的前三個建築位置
                </p>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  已選擇：{selectedCards.length}/3
                </p>
              </div>
            )}

            {gameStarted && gamePhase === 'complete' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '20px', color: '#f39c12', fontWeight: 'bold' }}>
                  遊戲完成！得分：{score}分
                </p>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { name: '大雄寶殿', emoji: '🏛️' },
                { name: '天王殿', emoji: '🏮' },
                { name: '觀音殿', emoji: '🏛' },
                { name: '藏經樓', emoji: '📚' },
                { name: '鐘樓', emoji: '🔔' },
                { name: '鼓樓', emoji: '🥁' }
              ].map((item, index) => {
                const isTargetCard = index < 3; // First 3 cards are the target
                const isVisible = !gameStarted || showingCards || gamePhase === 'recall' || gamePhase === 'complete';
                const isSelected = selectedCards.includes(index);
                const shouldHighlight = gameStarted && gamePhase === 'memorize' && isTargetCard;
                
                return (
                  <div 
                    key={index} 
                    style={{
                      backgroundColor: shouldHighlight ? '#fff3cd' : (isSelected ? '#d4edda' : '#f0f8f0'),
                      border: shouldHighlight ? '3px solid #ffc107' : (isSelected ? '3px solid #28a745' : '2px solid #90EE90'),
                      borderRadius: '10px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: gamePhase === 'recall' ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      opacity: isVisible ? 1 : 0.3
                    }}
                    onClick={() => handleCardClick(index)}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                      {isVisible ? item.emoji : '❓'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                      {isVisible ? item.name : '？？？'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '30px' }}>
              <button style={{
                backgroundColor: '#8B6914',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '15px'
              }} onClick={() => window.location.href = '/'}>
                返回首頁
              </button>
              {!gameStarted || gamePhase === 'complete' ? (
                <button style={{
                  backgroundColor: '#90EE90',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '15px 30px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }} onClick={startMemoryGame}>
                  {gamePhase === 'complete' ? '再玩一次' : '開始遊戲'}
                </button>
              ) : (
                <button style={{
                  backgroundColor: '#ccc',
                  color: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '15px 30px',
                  fontSize: '18px',
                  cursor: 'not-allowed'
                }} disabled>
                  遊戲進行中...
                </button>
              )}
            </div>
          </div>
        )}

        {gameType === 'memory-scripture' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', color: '#8B6914', marginBottom: '20px' }}>
              佛教經文概念記憶
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { name: '念佛', emoji: '🙏' },
                { name: '慈悲', emoji: '❤️' },
                { name: '智慧', emoji: '🧠' },
                { name: '禪定', emoji: '🧘' },
                { name: '功德', emoji: '✨' },
                { name: '因果', emoji: '🔄' }
              ].map((item, index) => (
                <div key={index} style={{
                  backgroundColor: '#fff5f0',
                  border: '2px solid #FFB366',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                    {item.emoji}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '30px' }}>
              <button style={{
                backgroundColor: '#8B6914',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '15px'
              }} onClick={() => window.location.href = '/'}>
                返回首頁
              </button>
              <button style={{
                backgroundColor: '#FFB366',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '18px',
                cursor: 'pointer'
              }} onClick={() => alert('記憶遊戲功能正在完善中！')}>
                開始遊戲
              </button>
            </div>
          </div>
        )}

        {!gameType && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              請選擇一個遊戲類型
            </p>
            <button style={{
              backgroundColor: '#8B6914',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '15px 30px',
              fontSize: '18px',
              cursor: 'pointer'
            }} onClick={() => window.location.href = '/'}>
              返回首頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}