/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Расширяем цветовую палитру для более тонкого контроля
        gray: {
          750: '#2d3748',
          850: '#1f2937',
          950: '#0f172a',
        },
      },
      animation: {
        // Добавляем кастомные анимации
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        // Определяем кастомные keyframes
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        }
      },
      backdropBlur: {
        // Добавляем вариант для backdrop-blur
        'sm': '4px',
      },
      boxShadow: {
        // Кастомные тени для кнопки и формы
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Плагин для стилизации форм
    require('tailwindcss-animate'), // Плагин для анимаций
  ],
}