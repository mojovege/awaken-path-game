import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';

// Scripture Memory Game Component
function ScriptureMemoryGame({ userReligion }: { userReligion: string }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const getGameContent = () => {
    if (userReligion === 'buddhism') {
      return {
        title: '佛教經文概念配對',
        pairs: [
          { id: 1, text: '念佛', match: '阿彌陀佛', emoji: '🙏' },
          { id: 2, text: '慈悲', match: '無緣大慈', emoji: '❤️' },
          { id: 3, text: '智慧', match: '般若波羅蜜', emoji: '🧠' },
          { id: 4, text: '禪定', match: '一心不亂', emoji: '🧘' },
          { id: 5, text: '功德', match: '廣種福田', emoji: '✨' },
          { id: 6, text: '因果', match: '善惡有報', emoji: '🔄' }
        ]
      };
    } else if (userReligion === 'taoism') {
      return {
        title: '道教經典概念配對',
        pairs: [
          { id: 1, text: '無為', match: '順其自然', emoji: '🌊' },
          { id: 2, text: '陰陽', match: '太極生兩儀', emoji: '☯️' },
          { id: 3, text: '道德', match: '上善若水', emoji: '⭐' },
          { id: 4, text: '修煉', match: '煉精化氣', emoji: '🧘' },
          { id: 5, text: '自然', match: '道法自然', emoji: '🌿' },
          { id: 6, text: '長生', match: '延年益壽', emoji: '🌸' }
        ]
      };
    } else {
      return {
        title: '媽祖信仰概念配對',
        pairs: [
          { id: 1, text: '護佑', match: '海上平安', emoji: '🛡️' },
          { id: 2, text: '慈航', match: '救苦救難', emoji: '⛵' },
          { id: 3, text: '靈驗', match: '有求必應', emoji: '✨' },
          { id: 4, text: '祈福', match: '風調雨順', emoji: '🙏' },
          { id: 5, text: '平安', match: '出入平安', emoji: '🕊️' },
          { id: 6, text: '豐收', match: '五穀豐登', emoji: '🌾' }
        ]
      };
    }
  };

  const gameContent = getGameContent();
  
  // Create shuffled cards array
  const createCards = () => {
    const cards: Array<{id: number, text: string, type: 'concept' | 'meaning', pairId: number}> = [];
    gameContent.pairs.forEach(pair => {
      cards.push({ id: cards.length, text: pair.text, type: 'concept', pairId: pair.id });
      cards.push({ id: cards.length, text: pair.match, type: 'meaning', pairId: pair.id });
    });
    return cards.sort(() => Math.random() - 0.5);
  };

  const [cards] = useState(createCards());

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || selectedPairs.length >= 2 || selectedPairs.includes(cardId) || matchedPairs.includes(cardId)) {
      return;
    }

    const newSelected = [...selectedPairs, cardId];
    setSelectedPairs(newSelected);

    if (newSelected.length === 2) {
      setAttempts(prev => prev + 1);
      const card1 = cards.find(c => c.id === newSelected[0]);
      const card2 = cards.find(c => c.id === newSelected[1]);
      
      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Match found!
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, ...newSelected]);
          setSelectedPairs([]);
          setScore(prev => prev + 10);
          
          if (matchedPairs.length + newSelected.length === cards.length) {
            alert(`恭喜完成配對！總得分：${score + 10}分，嘗試次數：${attempts + 1}次`);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setSelectedPairs([]);
        }, 1000);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setSelectedPairs([]);
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', color: '#8B6914', marginBottom: '20px' }}>
        {gameContent.title}
      </h2>
      
      {!gameStarted && (
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
            <strong>配對遊戲規則：</strong>
          </p>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
            1. 點擊兩張卡片，找出相關概念的配對
          </p>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
            2. 成功配對的卡片會保持顯示
          </p>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            3. 完成所有配對即可獲得最終分數
          </p>
        </div>
      )}

      {gameStarted && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', color: '#27ae60', fontWeight: 'bold' }}>
            得分：{score} | 嘗試次數：{attempts} | 已配對：{matchedPairs.length / 2}/{gameContent.pairs.length}
          </p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        maxWidth: '800px',
        margin: '0 auto 30px auto'
      }}>
        {cards.map(card => {
          const isSelected = selectedPairs.includes(card.id);
          const isMatched = matchedPairs.includes(card.id);
          const isVisible = !gameStarted || isSelected || isMatched;
          
          return (
            <div
              key={card.id}
              style={{
                backgroundColor: isMatched ? '#d4edda' : (isSelected ? '#fff3cd' : '#f8f9fa'),
                border: isMatched ? '3px solid #28a745' : (isSelected ? '3px solid #ffc107' : '2px solid #dee2e6'),
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                cursor: gameStarted && !isMatched ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => handleCardClick(card.id)}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                {isVisible ? card.text : '❓'}
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
        {!gameStarted || matchedPairs.length === cards.length ? (
          <button style={{
            backgroundColor: '#FFB366',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '18px',
            cursor: 'pointer'
          }} onClick={startGame}>
            {matchedPairs.length === cards.length ? '再玩一次' : '開始遊戲'}
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
  );
}

export default function SimpleGamePage() {
  const { gameType } = useParams<{ gameType: string }>();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showingCards, setShowingCards] = useState(true);
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'memorize' | 'recall' | 'complete'>('memorize');
  const [timeLeft, setTimeLeft] = useState(8);
  const [userReligion, setUserReligion] = useState<string>('buddhism');

  // Get user's religion from localStorage or API
  React.useEffect(() => {
    const userId = localStorage.getItem('userId') || 'demo-user-1';
    // Check if there's stored religion preference
    const storedReligion = localStorage.getItem('selectedReligion');
    if (storedReligion) {
      setUserReligion(storedReligion);
    }
    
    // Fetch from API if available
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.selectedReligion) {
          setUserReligion(data.selectedReligion);
        }
      })
      .catch(() => {
        // Use default or stored value
      });
  }, []);

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
              {userReligion === 'buddhism' && '佛教寺廟建築記憶'}
              {userReligion === 'taoism' && '道教宮觀建築記憶'}
              {userReligion === 'mazu' && '媽祖廟宇建築記憶'}
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
              {(() => {
                // Buddhist temple buildings
                if (userReligion === 'buddhism') {
                  return [
                    { name: '大雄寶殿', emoji: '🏛️' },
                    { name: '天王殿', emoji: '🏮' },
                    { name: '觀音殿', emoji: '🏛' },
                    { name: '藏經樓', emoji: '📚' },
                    { name: '鐘樓', emoji: '🔔' },
                    { name: '鼓樓', emoji: '🥁' }
                  ];
                }
                // Taoist temple buildings
                else if (userReligion === 'taoism') {
                  return [
                    { name: '三清殿', emoji: '⛩️' },
                    { name: '玉皇閣', emoji: '🏯' },
                    { name: '太極殿', emoji: '☯️' },
                    { name: '藏經閣', emoji: '📜' },
                    { name: '鐘亭', emoji: '🔔' },
                    { name: '鼓亭', emoji: '🥁' }
                  ];
                }
                // Mazu temple buildings
                else {
                  return [
                    { name: '正殿', emoji: '🏛️' },
                    { name: '媽祖廟', emoji: '🛕' },
                    { name: '觀音亭', emoji: '🏮' },
                    { name: '文昌閣', emoji: '📚' },
                    { name: '鐘樓', emoji: '🔔' },
                    { name: '香客大樓', emoji: '🏢' }
                  ];
                }
              })().map((item, index) => {
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
          <ScriptureMemoryGame userReligion={userReligion} />
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