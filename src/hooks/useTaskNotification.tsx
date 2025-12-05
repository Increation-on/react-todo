import { useNotificationStore } from "../store/NotificationStore.tsx";

// Вспомогательная функция для обрезки длинного текста
const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const useTaskNotifications = () => {
  const { showNotification } = useNotificationStore();
  
  return {
    // Создание задачи (обрезаем длинный текст)
    created: (taskText: string) => {
      const displayText = truncateText(taskText);
      showNotification('task', `✅ СОЗДАНО: "${displayText}"`, 'success', 3000);
    },
    
    // Обновление задачи (обрезаем длинный текст)
    updated: (taskText: string) => {
      const displayText = truncateText(taskText);
      showNotification('task', `✏️ ОБНОВЛЕНО: "${displayText}"`, 'success', 3000);
    },
    
    // Удаление задачи (обрезаем длинный текст)
    deleted: (taskText: string) => {
      const displayText = truncateText(taskText);
      showNotification('task', `🗑️ УДАЛЕНО: "${displayText}"`, 'warning', 3000);
    },
    
    // Переключение статуса (обрезаем длинный текст)
    toggled: (taskText: string, isCompleted: boolean) => {
      const displayText = truncateText(taskText);
      const status = isCompleted ? '✅ ВЫПОЛНЕНА' : '🔄 АКТИВНА';
      showNotification('task', `${status}: "${displayText}"`, 'info', 2000);
    },
    
    // Ошибки (не обрезаем, обычно они короткие)
    error: (message: string) => {
      showNotification('task', `❌ ОШИБКА: ${message}`, 'error', 5000);
    },
    
    // Подтверждение удаления (обрезаем в основном сообщении)
    confirmDelete: (taskText: string, onConfirm: () => void) => {
      const displayText = truncateText(taskText, 40); // Более короткое обрезание для подтверждения
      showNotification(
        'task', 
        `⚠️ УДАЛИТЬ: "${displayText}"?`, 
        'error',
        10000,
        [
          {
            label: 'ПОДТВЕРДИТЬ',
            onClick: () => {
              onConfirm();
              const confirmDisplayText = truncateText(taskText);
              showNotification('task', `✅ УДАЛЕНО: "${confirmDisplayText}"`, 'success', 3000);
            },
            type: 'primary' as const
          },
          {
            label: 'ОТМЕНА',
            onClick: () => {
              const cancelDisplayText = truncateText(taskText);
              showNotification('task', `🚫 ОТМЕНЕНО: "${cancelDisplayText}"`, 'info', 2000);
            },
            type: 'secondary' as const
          }
        ]
      );
    },
    
    // Информационное сообщение
    info: (message: string) => {
      const displayText = truncateText(message);
      showNotification('task', `ℹ️ ${displayText}`, 'info', 3000);
    },
    
    // Уведомления для API операций (новый блок)
    api: {
      // Успешная загрузка задач
      loadSuccess: (count: number) => {
        const messages = [
          `📡 ДАННЫЕ ПОЛУЧЕНЫ: ${count} ЗАДАЧ`,
          `⚡ СИНХРОНИЗАЦИЯ: +${count} ЕДИНИЦ`,
          `📊 БАЗА ОБНОВЛЕНА: ${count} ЗАПИСЕЙ`,
          `🚀 ИМПОРТ ВЫПОЛНЕН: ${count} ЗАДАЧ`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        showNotification('system', randomMessage, 'success', 4000);
      },
      
      // Ошибка загрузки
      loadError: (errorMessage: string = 'Ошибка загрузки') => {
        const messages = [
          `💥 СБОЙ СИСТЕМЫ: ${errorMessage}`,
          `📡 ОШИБКА СВЯЗИ: ${errorMessage}`,
          `⚠️ СЕРВЕР НЕДОСТУПЕН: ${errorMessage}`,
          `❌ СИНХРОНИЗАЦИЯ ПРЕРВАНА: ${errorMessage}`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        showNotification('system', randomMessage, 'error', 5000);
      },
      
      // Загрузка началась
      loading: () => {
        showNotification('system', '⏳ ЗАГРУЗКА ДАННЫХ...', 'info', 2000);
      },
      
      // Нет данных
      noData: () => {
        showNotification('system', '📭 НЕТ ДАННЫХ ДЛЯ ЗАГРУЗКИ', 'info', 3000);
      }
    }
  };
};