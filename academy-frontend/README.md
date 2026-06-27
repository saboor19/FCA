
## `README.md`

```markdown
# Academy Management System

A modern, full-stack academy management platform built with **Next.js 14**, **Node.js**, **MongoDB**, and **Tailwind CSS**. Designed for teachers, students, and administrators with role-based access control, real-time notifications, and a premium UI/UX.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Study Materials System](#study-materials-system)
- [File Storage](#file-storage)
- [Contributing](#contributing)

---

## Features

### Teacher Portal
- **Study Material Management**: Create, edit, publish, archive, delete, duplicate, and share study materials
- **Batch Assignment**: Manage batches, courses, and modules
- **File Attachments**: Upload PDF, Word, PowerPoint, Excel, ZIP files via GridFS
- **Sharing**: Share materials across batches of the same course
- **Analytics**: Track view counts, download counts, and version history

### Student Portal
- **Material Discovery**: Browse, search, and filter study materials by type, difficulty, and course
- **Read-Only Access**: View published materials with rich text rendering
- **File Preview & Download**: Preview supported files inline, download attachments
- **Batch Context**: See course, module, and batch information for each material

### Shared Features
- **Rich Text Editor**: TipTap-powered WYSIWYG editor for formatted content
- **Theme System**: Warm, accessible color palette with light/dark mode
- **Responsive Design**: Mobile-first, fluid layouts with premium animations
- **Accessibility**: ARIA labels, keyboard navigation, focus rings, screen reader support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **File Storage** | MongoDB GridFS |
| **Authentication** | JWT (HTTP-only cookies) |
| **Rich Text** | TipTap / React-Quill |
| **Maps** | Leaflet (OpenStreetMap) |
| **Icons** | Lucide React |

---

## Project Structure

```
academy-web-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── teacher/                  # Teacher dashboard
│   │   ├── study-materials/      # Study material pages
│   │   │   ├── page.jsx          # List view
│   │   │   ├── [id]/             # Detail view
│   │   │   │   └── page.jsx
│   │   │   └── [id]/edit/        # Edit view
│   │   │       └── page.jsx
│   │   └── ...
│   ├── student/                  # Student dashboard
│   │   └── study-materials/      # Student material pages
│   │       ├── page.jsx          # List view
│   │       └── [id]/             # Detail view
│   │           └── page.jsx
│   ├── layout.jsx                # Root layout with AuthProvider
│   └── globals.css               # Theme variables, Tailwind config
│
├── components/                   # Reusable UI components
│   ├── common/
│   │   ├── forms/                # Input, Select, Textarea, RichTextEditor
│   │   ├── buttons/              # ActionButton
│   │   ├── badges/               # StatusBadge
│   │   └── table/                # DataTable, TableRow, TableCell
│   ├── study-material/
│   │   ├── StudyMaterialForm.jsx # Create/Edit form
│   │   ├── StudyMaterialFilters.jsx
│   │   └── StudyMaterialUploadModal.jsx
│   └── dashboard/
│       └── DashboardLayout.jsx
│
├── context/
│   └── AuthContext.jsx           # Global auth state
│
├── services/                     # API service layer
│   ├── teacher/
│   │   └── studyMaterialService.js
│   ├── student/
│   │   └── studyMaterialService.js
│   ├── authService.js
│   └── fileService.js
│
├── lib/
│   └── api.js                    # Axios instance with interceptors
│
└── server/                       # Backend (Node.js/Express)
    ├── config/
    │   ├── database.js
    │   └── gridfs.js             # GridFS bucket setup
    ├── controllers/
    │   ├── teacher/
    │   │   └── studyMaterialController.js
    │   ├── student/
    │   │   └── studyMaterialController.js
    │   └── ...
    ├── models/
    │   ├── StudyMaterial.js
    │   ├── Teacher.js
    │   ├── Student.js
    │   ├── Course.js
    │   ├── Batch.js
    │   └── ...
    ├── routes/
    │   ├── teacher/
    │   │   └── studyMaterialRoutes.js
    │   ├── student/
    │   │   └── studyMaterialRoutes.js
    │   └── ...
    ├── middlewares/
    │   ├── authMiddleware.js       # protect, authorizeRoles
    │   └── errorMiddleware.js
    └── utils/
        ├── apiFeatures.js          # Search, filter, sort, paginate
        └── fileHelpers.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/academy-web-app.git
cd academy-web-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Development

```bash
# Start backend (from server directory)
cd server
npm run dev

# Start frontend (from root directory)
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## Environment Variables

### Frontend (`/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`/server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academy_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Teacher — Study Materials

All routes require `Authorization: Bearer <token>` header and `TEACHER` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teacher/study-materials` | Create material (draft) |
| GET | `/api/teacher/study-materials` | List my materials |
| GET | `/api/teacher/study-materials/:id` | Get single material |
| PUT | `/api/teacher/study-materials/:id` | Update material |
| DELETE | `/api/teacher/study-materials/:id` | Soft delete material |
| PATCH | `/api/teacher/study-materials/:id/publish` | Publish material |
| PATCH | `/api/teacher/study-materials/:id/unpublish` | Unpublish material |
| PATCH | `/api/teacher/study-materials/:id/archive` | Archive material |
| PATCH | `/api/teacher/study-materials/:id/restore` | Restore material |
| POST | `/api/teacher/study-materials/:id/duplicate` | Duplicate material |
| PATCH | `/api/teacher/study-materials/:id/share` | Share with batches |
| PATCH | `/api/teacher/study-materials/:id/unshare` | Unshare batches |
| GET | `/api/teacher/study-materials/:id/shareable-batches` | Get shareable batches |
| POST | `/api/teacher/study-materials/:id/attachments` | Upload attachment |
| GET | `/api/teacher/study-materials/:id/attachments` | List attachments |
| GET | `/api/teacher/study-materials/:id/attachments/:attachmentId/preview` | Preview file |
| GET | `/api/teacher/study-materials/:id/attachments/:attachmentId/download` | Download file |
| DELETE | `/api/teacher/study-materials/:id/attachments/:attachmentId` | Delete attachment |

### Student — Study Materials

All routes require `Authorization: Bearer <token>` header and `STUDENT` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/study-materials` | List accessible materials |
| GET | `/api/student/study-materials/:id` | Get single material |
| GET | `/api/student/study-materials/:id/attachments/:attachmentId/preview` | Preview file |
| GET | `/api/student/study-materials/:id/attachments/:attachmentId/download` | Download file |

---

## Database Schema

### StudyMaterial

```javascript
{
  materialNumber: String,      // Auto-generated unique ID
  title: String,               // Required
  summary: String,               // HTML content
  body: String,                  // HTML content
  type: Enum ["NOTES", "PDF", "VIDEO", "SLIDES", "DOCUMENT", "CHEATSHEET", "CODE", "LAB", "REFERENCE", "OTHER"],
  
  course: ObjectId (ref: Course),
  moduleId: ObjectId,
  sourceBatch: ObjectId (ref: Batch),
  sharedBatches: [ObjectId] (ref: Batch),
  
  visibility: Enum ["BATCH_ONLY", "SHARED_BATCHES"],
  status: Enum ["DRAFT", "PUBLISHED", "ARCHIVED"],
  difficulty: Enum ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  
  attachments: [{
    fileId: ObjectId,          // GridFS file reference
    filename: String,
    originalName: String,
    contentType: String,
    extension: String,
    size: Number,
    uploadedBy: ObjectId (ref: Teacher),
    uploadedAt: Date,
    downloadCount: Number,
    isPreviewable: Boolean
  }],
  
  tags: [String],
  estimatedReadTime: Number,
  isDownloadable: Boolean,
  
  // Analytics
  downloadCount: Number,
  viewCount: Number,
  
  // Audit
  createdBy: ObjectId (ref: Teacher),
  updatedBy: ObjectId (ref: Teacher),
  publishedAt: Date,
  version: Number,
  
  // Soft Delete
  isDeleted: Boolean,
  deletedAt: Date,
  deletedBy: ObjectId (ref: User)
}
```

---

## Authentication & Authorization

### JWT Flow
1. User logs in → receives HTTP-only cookie with JWT
2. Frontend Axios interceptor sends cookie with every request
3. Backend `protect` middleware verifies JWT
4. `authorizeRoles("TEACHER" | "STUDENT" | "ADMIN")` restricts access

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Teacher** | CRUD study materials, manage batches, upload files, share content |
| **Student** | Read-only access to published materials from enrolled batches |
| **Admin** | Full system access (future implementation) |

---

## Study Materials System

### Lifecycle

```
DRAFT → PUBLISHED → ARCHIVED
  ↑        ↓
  └──── RESTORE (from soft delete)
```

### Visibility Rules

| Visibility | Who Can See |
|------------|-------------|
| `BATCH_ONLY` | Students in `sourceBatch` only |
| `SHARED_BATCHES` | Students in `sourceBatch` + `sharedBatches` |

### Sharing Constraints
- Can only share with batches of the **same course**
- Teacher must be assigned to the target batch
- Source batch is excluded from shareable options

### File Attachments
- **Max 10 attachments** per material
- **Allowed types**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP
- **Storage**: MongoDB GridFS (not local filesystem)
- **Preview**: Inline streaming for supported types
- **Download**: Direct download with count tracking

---

## File Storage

### GridFS Setup

Files are stored in MongoDB via GridFS, not on disk. This ensures:
- Files are backed up with database
- No filesystem path issues
- Scalable across multiple servers

```javascript
// config/gridfs.js
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gridFSBucket;

const getGridFSBucket = () => {
  if (!gridFSBucket) {
    gridFSBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "attachments",
    });
  }
  return gridFSBucket;
};

module.exports = { getGridFSBucket };
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TipTap](https://tiptap.dev/)
- [Lucide Icons](https://lucide.dev/)
- [MongoDB](https://www.mongodb.com/)
```
