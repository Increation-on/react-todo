import { useState, useEffect, KeyboardEvent } from 'react';
import { useUIStore } from '../../store/UIStore.jsx';
import { useTaskStore } from '../../store/TaskStore.tsx';
import { useTaskNotifications } from '../../hooks/ui/useTaskNotification.tsx';
import './../../styles/EditModal.css';

const EditModal = () => {
  const { editModal, closeEditModal } = useUIStore();
  const { updateTaskText } = useTaskStore();
  const taskNotify = useTaskNotifications(); // Добавляем хук
  
  const [inputValue, setInputValue] = useState('');
  
  // Сбрасываем значение при открытии модалки
  useEffect(() => {
    if (editModal?.initialText !== undefined) {
      setInputValue(editModal.initialText);
    }
  }, [editModal?.initialText, editModal?.isOpen]);
  
  if (!editModal || !editModal.isOpen) return null;
  
  const isTextValid = 
    inputValue.trim() !== '' && 
    inputValue.trim() !== (editModal.initialText || '').trim();
  
  const handleSave = () => {
    if (isTextValid && editModal?.taskId) {
      const trimmedText = inputValue.trim();
      updateTaskText(editModal.taskId, trimmedText);
      closeEditModal();
      
      // 👇 ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ ПОСЛЕ СОХРАНЕНИЯ
      taskNotify.updated(trimmedText);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      closeEditModal();
    }
    if (e.key === 'Enter' && isTextValid) {
      handleSave();
    }
  };
  
  return (
    <div 
      className={`edit-modal__overlay ${editModal.isOpen ? 'edit-modal--visible' : 'edit-modal--hidden'}`}
      onClick={closeEditModal}
    >
      <div 
        className="edit-modal__content"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="edit-modal__title">✏️ Edit Task</h3>
        
        <input
          type="text"
          className="edit-modal__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter task text..."
          autoFocus
        />
        
        <div className="edit-modal__actions">
          <button 
            onClick={handleSave}
            disabled={!isTextValid}
            className="edit-modal__btn edit-modal__btn--save"
          >
            💾 Save
          </button>
          
          <button 
            onClick={closeEditModal}
            className="edit-modal__btn edit-modal__btn--cancel"
          >
            ❌ Cancel
          </button>
        </div>
        
        {/* Подсказка для пользователя */}
        {!isTextValid && inputValue.trim() !== '' && (
          <div className="edit-modal__hint">
            Измените текст задачи для сохранения
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;