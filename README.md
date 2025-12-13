# 🔮 Cyberpunk Kanban Board

Modern task management application with cyberpunk aesthetics, priority-based drag & drop, and full mobile support.

## 🚀 Live Demo

**[View Live Application](https://react-todo-phi-wheat.vercel.app/login)**

## ✨ Features

### 🎯 **Task Management**
- **Priority System** - High/Medium/Low/None with color-coded visualization
- **Drag & Drop** - Intuitive DnD for both desktop and mobile
- **Smart Sorting** - Automatic organization by priority and status
- **Persistent Storage** - Zustand with localStorage persistence

### 📱 **Mobile Experience**
- **Touch-Friendly DnD** - Optimized for mobile devices
- **Adaptive Layout** - Responsive design (≤768px mobile, ≥769px desktop)
- **Mobile Priority Menu** - Quick priority changes via floating menu

### 🎨 **Cyberpunk Aesthetics**
- **Neon Color Scheme** - #ff00ff, #00ffff, #00ff00 accents
- **Glitch Effects** - Animated scan lines and visual distortions
- **Dark Theme** - Reduced eye strain with high contrast elements

### 🔐 **User Experience**
- **JWT Authentication** - Secure login/registration
- **User Isolation** - Each user sees only their tasks
- **Protected Routes** - Automatic redirection based on auth status
- **Real-time Updates** - Instant feedback on all actions

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **Zustand** | State management with persistence |
| **@dnd-kit** | Drag & drop functionality |
| **React Router v6** | Client-side routing |

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/Increation-on/react-todo.git
```
## 🎮 How to Use

1. **Create Task** → Added to "None" priority column  
2. **Set Priority** → Drag between columns or use mobile menu (⋮)  
3. **Organize** → Active/Completed views for workflow  
4. **Mobile** → Long press to drag, tap ⋮ for quick actions  

## 🔧 Architecture Highlights

- **State:** Zustand stores (TaskStore, AuthStore)  
- **DnD:** Custom algorithms for smooth column transitions  
- **Hooks:** `useTaskDnD`, `usePriorityTasks`, `useTokenWatch`  
- **Styling:** Cyberpunk design system  
- **Optimizations:** Code splitting, memoization, debounced inputs  

## 🚀 Performance

- Route-based code splitting  
- Optimistic UI updates  
- Minimal re-renders during DnD  
- Mobile touch gesture optimization  

## 🤝 Contributing

1. Fork repo  
2. Create feature branch (`git checkout -b feature/amazing`)  
3. Commit changes (`git commit -m 'Add amazing'`)  
4. Push branch (`git push origin feature/amazing`)  
5. Open Pull Request  

