import React from 'react';
import { useParams } from 'wouter';

export default function SimpleGamePage() {
  const { gameType } = useParams<{ gameType: string }>();

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
                { name: '觀音殿', emoji: '🪷' },
                { name: '藏經樓', emoji: '📚' },
                { name: '鐘樓', emoji: '🔔' },
                { name: '鼓樓', emoji: '🥁' }
              ].map((item, index) => (
                <div key={index} style={{
                  backgroundColor: '#f0f8f0',
                  border: '2px solid #90EE90',
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
                backgroundColor: '#90EE90',
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