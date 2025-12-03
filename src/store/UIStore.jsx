// stores/uiStore.js
import { create } from 'zustand'

export const useUIStore = create((set) => ({
  // 🎯 ТОЛЬКО то, что нужно для модалки редактирования
  editModal: {
    isOpen: false,
    taskId: null,
    initialText: '',
  },
  
  // 🎮 Простые actions
  openEditModal: (taskId, initialText) => 
    set({
      editModal: {
        isOpen: true,
        taskId,
        initialText,
      }
    }),
    
  closeEditModal: () =>
    set({
      editModal: {
        isOpen: false,
        taskId: null,
        initialText: '',
      }
    }),
}))