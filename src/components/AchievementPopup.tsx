import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface AchievementPopupProps {
  isOpen: boolean
  onClose: () => void
  award?: string
}

export function AchievementPopup({ isOpen, onClose, award }: AchievementPopupProps) {
  useEffect(() => {
    if (isOpen) {
      // Запускаем конфетти
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Закрываем попап через 2 секунды
      const timer = setTimeout(() => {
        onClose()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Временно убираем проверку для постоянного отображения
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg">
        <div className="text-xl font-bold text-center mb-2">
          Поздравляем с достижением цели!
        </div>
        {award && (
          <div className="text-lg text-center mb-3">
            Ваша награда: {award}
          </div>
        )}
        <div className="flex gap-3">
          <span className="text-3xl animate-bounce">🎉</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎊</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏆</span>
        </div>
      </div>
    </div>
  )
} 