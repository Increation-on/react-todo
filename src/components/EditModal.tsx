// EditModal.tsx - чистая рабочая версия
import { useState, useEffect } from 'react'
import { useUIStore } from '../store/UIStore'
import { useTaskStore } from '../store/TaskStore.tsx'
import './styles/EditModal.css'

const EditModal = () => {
  const { editModal, closeEditModal } = useUIStore()
  const { updateTaskText } = useTaskStore() // 👈 используем updateTask (а не updateTaskText)
  
  const [inputValue, setInputValue] = useState('')
  
  useEffect(() => {
    if (editModal?.initialText !== undefined) {
      setInputValue(editModal.initialText)
    }
  }, [editModal?.initialText, editModal?.isOpen])
  
  if (!editModal || !editModal.isOpen) return null
  
  const isTextValid = 
    inputValue.trim() !== '' && 
    inputValue.trim() !== (editModal.initialText || '').trim()
  
  const handleSave = () => {
    if (isTextValid && editModal?.taskId) {
      updateTaskText(editModal.taskId, inputValue.trim()) // 👈 вызываем updateTask
      closeEditModal()
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeEditModal()
    if (e.key === 'Enter' && isTextValid) handleSave()
  }
  
  return (
    <div 
      className={`edit-modal__overlay ${editModal.isOpen ? 'edit-modal--visible' : 'edit-modal--hidden'}`}
      onClick={closeEditModal}
    >
      <div 
        className="edit-modal__content"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="edit-modal__title">Edit Task</h3>
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
            Save
          </button>
          <button 
            onClick={closeEditModal}
            className="edit-modal__btn edit-modal__btn--cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal