import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface AchievementPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function AchievementPopup({ isOpen, onClose }: AchievementPopupProps) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in" />
      <div className="relative bg-white rounded-lg p-8 shadow-xl transform transition-all duration-300 animate-scale-in">
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-bold text-center">
            Поздравляем с достижением цели!
          </div>
          <div className="flex gap-2">
            <span className="text-6xl animate-bounce">🎉</span>
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎊</span>
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏆</span>
          </div>
        </div>
      </div>
    </div>
  )
} 