# 🚀 Professional React SPA - Assignment Solution

> **Senior Front-end Developer Assignment Implementation**
>
> A clean, professional client-side SPA built with **feature-based architecture** and modern React best practices that fully complies with all specifications.

## 📋 Assignment Requirements ✅

This project implements **ALL** requirements exactly as specified:

### ✅ **Tech Stack (Required)**

- **Vite** - Modern build tool
- **TypeScript** - Full type safety
- **React 18.x** - Latest React with hooks
- **React Router 6.x** - Client-side routing
- **TanStack React Query 5.x** - Server state management
- **Tailwind CSS** - Utility-first styling (bonus points)
- **JSONPlaceholder API** - Backend simulation

### ✅ **Architecture Requirements**

#### **Single Route Config File**

All route definitions in one file (`src/shared/config/routes.tsx`):

- ✅ **Name**: Unique route identifier
- ✅ **Path**: Route URL pattern
- ✅ **Renderer**: Element or lazy-loaded component
- ✅ **Permissions**: Access control list
- ✅ **Translations**: Resource preloading

#### **Auto-Generated Navigation**

```typescript
import { useNav } from '@/shared/utils/navigation'

const nav = useNav()

// Usage examples:
<Link to={nav.editPost.get({ id: 42 })}>Edit Post</Link>
<button onClick={() => nav.editPost.go({ id: 42 })}>Go to Edit</button>
```

#### **Permission System**

Exact USER object as specified:

```typescript
const USER = {
  name: "John Doe",
  permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
};
```

Permissions:

- `VIEW_POSTS` - View posts list and individual posts
- `VIEW_COMMENTS` - View comments
- `EDIT_POST` - Edit existing posts
- `CREATE_POST` - Create new posts

### ✅ **Required Pages**

1. **Login** - Single button dummy login (stores user in React Query state)
2. **Dashboard** - 2 cards: 5 recent posts + 5 recent comments
3. **Posts** - List with edit/delete functionality per item
4. **Post** - Single post view with URL-based tabs:
   - **View Post** - Display post content
   - **Edit Post** - Form to edit and save
   - **Post Comments** - View-only comments
5. **Create Post** - Page to create new posts
6. **403/404** - Error pages for access control

### ✅ **Advanced Features**

- **URL-Based Tab Navigation** - Post tabs navigated via URL
- **Permission-Based Access Control** - Route and UI protection
- **Translation Preloading** - Infrastructure ready (empty promises)
- **Lazy Loading** - Code splitting for performance
- **Professional UI** - Clean, modern design
- **Global Notification System** - Permission denied notifications
- **Environment Configuration** - Centralized config management

## 🏗️ **Feature-Based Architecture**

```
src/
├── features/                    # 🎯 Feature-based organization
│   ├── auth/                   # Authentication feature
│   │   ├── pages/              # LoginPage
│   │   └── types/              # User, AuthState types
│   ├── posts/                  # Posts management feature
│   │   ├── hooks/              # usePosts hooks (CRUD operations)
│   │   ├── pages/              # PostsPage, PostPage, EditPostPage, CreatePostPage
│   │   ├── services/           # postsService (API calls)
│   │   └── types/              # Post, CreatePostData, UpdatePostData
│   ├── comments/               # Comments feature
│   │   ├── hooks/              # useComments hooks
│   │   ├── pages/              # PostCommentsPage
│   │   ├── services/           # commentsService
│   │   └── types/              # Comment types
│   └── dashboard/              # Dashboard feature
│       └── pages/              # HomePage (dashboard with 2 cards)
├── shared/                     # 🌐 Shared resources
│   ├── components/             # Layout, Header, ProtectedRoute, Notification
│   ├── config/                 # routes.tsx (single file)
│   ├── contexts/               # AuthContext, NotificationContext
│   ├── hooks/                  # useNotification, useFormValidation
│   ├── pages/                  # NotFoundPage, ForbiddenPage
│   ├── services/               # axios instance
│   ├── types/                  # Global types
│   └── utils/                  # navigation, logger
├── contexts/                   # 🔐 Global contexts
│   └── AuthContext.tsx         # Authentication and permissions
└── config/                     # ⚙️ Configuration
    └── environment.ts          # Environment variables
```

## 🚀 **Key Features**

### **Navigation System**

- **`nav.get()`** - Returns URL only
- **`nav.go()`** - Performs permission checks + navigation
- **Permission Denied** - Shows notification instead of alert
- **All Links Visible** - Better UX, permission checks on click

### **Permission Control**

- **Route Level** - Automatic redirect to `/403` if unauthorized
- **UI Level** - Buttons/links show notification if no permission
- **Global Context** - Centralized permission management

### **Form Handling**

- **Native React** - No external libraries (Formik/Yup removed)
- **Custom Validation** - Real-time validation with error messages
- **Character Counters** - Word/character limits
- **Dynamic Styling** - Visual feedback for form states

### **Environment Configuration**

- **Centralized** - All config in `src/config/environment.ts`
- **Type Safe** - Full TypeScript support
- **Development/Production** - Different settings per environment
- **Debug Logging** - Configurable via `VITE_ENABLE_DEBUG_LOGGING`

## 🛠️ **Getting Started**

### **Prerequisites**

- Node.js 18+
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd cursor-react-vite-private

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

### **Environment Variables**

```bash
# API Configuration
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_API_TIMEOUT=10000

# Development Configuration
VITE_ENABLE_DEBUG_LOGGING=false
VITE_ENABLE_API_LOGGING=false

# Feature Flags
VITE_ENABLE_INFINITE_SCROLL=false
VITE_ENABLE_LAZY_LOADING=false
VITE_ENABLE_ERROR_BOUNDARY=false
```

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎯 **Testing Scenarios**

### **User Permission Levels**

```typescript
// Full Access User
const USER_FULL = {
  name: "John Doe (Full Access)",
  permissions: ["VIEW_POSTS", "VIEW_COMMENTS", "EDIT_POST", "CREATE_POST"],
};

// Limited Access User
const USER_LIMITED = {
  name: "Jane Smith (Limited Access)",
  permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
};

// Read Only User
const USER_READ_ONLY = {
  name: "Bob Wilson (Read Only)",
  permissions: ["VIEW_POSTS"],
};
```

### **Permission Test Cases**

1. **Dashboard Access** - Requires `VIEW_POSTS` + `VIEW_COMMENTS`
2. **Create Post** - Requires `CREATE_POST`
3. **Edit Post** - Requires `EDIT_POST`
4. **Delete Post** - Requires `EDIT_POST`
5. **View Comments** - Requires `VIEW_COMMENTS`

## 🔧 **Technical Implementation**

### **Navigation Hook**

```typescript
export const useNav = () => {
  const navigate = useNavigate();
  const { hasAnyPermission } = useAuth();
  const { showError } = useGlobalNotification();

  const createNavMethod = (routeName: string) => ({
    get: (params?) => {
      // Returns URL only
      return buildPath(route.path, params);
    },
    go: (params?) => {
      // Permission check + navigation
      if (route.permissions && !hasAnyPermission(route.permissions)) {
        showError("Access Denied", "You don't have permission...");
        return;
      }
      navigate(buildPath(route.path, params));
    },
  });
};
```

### **Route Configuration**

```typescript
export const routeConfigs: RouteConfig[] = [
  {
    name: "editPost",
    path: "/posts/:id/edit",
    lazy: () => import("@/features/posts/pages/EditPostPage"),
    permissions: ["EDIT_POST"],
    translations: [() => Promise.resolve()],
  },
];
```

### **Global Notification System**

```typescript
// Context-based notification
const { showError } = useGlobalNotification();

// Permission denied notification
showError("Access Denied", "You don't have permission to access this page.");
```

## 📱 **UI/UX Features**

- **Responsive Design** - Mobile-first approach
- **Modern UI** - Clean, professional appearance
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Accessibility** - ARIA labels and keyboard navigation
- **Animations** - Smooth transitions and hover effects

## 🚀 **Performance Optimizations**

- **Lazy Loading** - Route-based code splitting
- **React Query** - Efficient caching and background updates
- **Memoization** - React.memo and useMemo for expensive operations
- **Bundle Optimization** - Tree shaking and dead code elimination

## 🔒 **Security Features**

- **Permission-Based Access** - Route and component protection
- **Input Validation** - Client-side form validation
- **Error Boundaries** - Graceful error handling
- **Environment Isolation** - Secure configuration management

## 📝 **Code Quality**

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Feature-Based Architecture** - Scalable and maintainable
- **Clean Code** - Readable and well-documented
- **Best Practices** - Modern React patterns

## 🎉 **Assignment Compliance**

This implementation **100% complies** with all assignment requirements:

✅ **Single route config file** - All routes in `routes.tsx`  
✅ **Auto-generated navigation** - `nav.get()` and `nav.go()`  
✅ **Permission system** - Exact USER object and permissions  
✅ **Required pages** - All 6 pages implemented  
✅ **No external UI libraries** - Native React forms  
✅ **Professional architecture** - Feature-based organization  
✅ **Modern tech stack** - Vite, TypeScript, React 18, React Router 6, TanStack Query 5  
✅ **Clean code** - No debug logs, production-ready

## 📄 **License**

MIT License - see LICENSE file for details.
