# Freelancer OS Dashboard

A comprehensive Notion-style dashboard built with Next.js and Firebase that helps freelancers manage clients, projects, tasks, finances, invoices, and goals — all in one place.

## 🚀 Features

### 📊 Home Dashboard

-   Central hub with quick links to all sections
-   Progress bars showing completion rates
-   Today's focus tasks
-   Financial overview with monthly stats

### 🧾 Client Tracker

-   Complete client database with contact information
-   Status tracking (Lead, Active, Completed)
-   Payment status monitoring
-   Multiple view modes (Grid, List, Board)

### 📁 Project Manager

-   Kanban board for project status tracking
-   Client-project relationships
-   Budget tracking
-   Due date management

### ✅ Task Board

-   Drag-and-drop Kanban interface
-   Priority levels (High, Medium, Low)
-   Deadline tracking with overdue alerts
-   Project-task relationships

### 💰 Finance Tracker

-   Income and expense tracking
-   Monthly financial summaries
-   Payment method categorization
-   Client and project associations

### 📄 Invoice Generator

-   Professional invoice templates
-   Itemized billing
-   Client and project integration
-   Multiple status tracking (Draft, Sent, Paid, Overdue)

### 🎯 Goals Tracker

-   Personal and professional goal setting
-   Progress tracking with visual bars
-   Category organization (Work, Personal, Financial)
-   Target date management

### 📚 Resources Library

-   Tool and link organization
-   Category-based filtering
-   Type classification (Tools, Articles, Videos)
-   Quick access to external resources

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 18, TypeScript
-   **Styling**: Tailwind CSS with custom beige/gray/black theme
-   **Database**: Firebase Realtime Database
-   **Icons**: Lucide React
-   **State Management**: React hooks with Firebase integration

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   Firebase project

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd freelance-dashboard
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up Firebase**

    - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
    - Enable Realtime Database
    - Get your Firebase configuration

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── clients/           # Client management
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   ├── finances/          # Finance tracking
│   ├── invoices/          # Invoice generation
│   ├── goals/             # Goal tracking
│   ├── resources/         # Resource library
│   └── page.tsx           # Home dashboard
├── components/            # Reusable components
│   ├── Layout.tsx         # Main layout with navigation
│   ├── Dashboard/         # Dashboard components
│   ├── Clients/           # Client-related components
│   ├── Projects/          # Project-related components
│   ├── Tasks/             # Task-related components
│   ├── Finances/          # Finance-related components
│   ├── Invoices/          # Invoice-related components
│   ├── Goals/             # Goal-related components
│   └── Resources/         # Resource-related components
├── hooks/                 # Custom React hooks
│   └── useDatabase.ts     # Firebase database hooks
├── lib/                   # Utility functions
│   ├── firebase.ts        # Firebase configuration
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
    └── database.ts        # Database schema types
```

## 🎨 Design System

The application uses a carefully crafted beige/gray/black color palette inspired by Notion:

-   **Primary**: Stone-900 (#1c1917) - Deep charcoal for text and primary actions
-   **Background**: Stone-50 (#fefdfb) - Warm off-white background
-   **Muted**: Stone-100 (#f5f5f4) - Light beige for secondary elements
-   **Borders**: Stone-200 (#e7e5e4) - Subtle borders and dividers
-   **Accents**: Various colors for status indicators and categories

## 🔧 Customization

### Adding New Features

1. **Create new database types** in `src/types/database.ts`
2. **Add Firebase hooks** in `src/hooks/useDatabase.ts`
3. **Build components** in the appropriate `src/components/` directory
4. **Create pages** in `src/app/` following the existing pattern
5. **Update navigation** in `src/components/Layout.tsx`

### Styling

The application uses Tailwind CSS with custom CSS variables. To modify the color scheme:

1. Update CSS variables in `src/app/globals.css`
2. Modify Tailwind classes throughout components
3. Ensure accessibility with proper contrast ratios

## 📱 Responsive Design

The dashboard is fully responsive and works seamlessly across:

-   Desktop (1024px+)
-   Tablet (768px - 1023px)
-   Mobile (320px - 767px)

## 🔒 Security

-   Firebase Realtime Database rules should be configured for production
-   Environment variables are properly secured
-   Client-side validation with server-side verification recommended

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

-   Netlify
-   AWS Amplify
-   Railway
-   DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Inspired by Notion's clean and functional design
-   Built with modern web technologies
-   Icons provided by Lucide React
-   Styling powered by Tailwind CSS

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Happy freelancing! 🚀**
