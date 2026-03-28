# FlashChat ⚡

Real-time chat application built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Real-time messaging** - Messages appear instantly using Supabase Realtime
- **20 chat rooms** - From #general to #coding, #anime, #pets, and more
- **Anonymous auth** - Chat as a guest or create an account
- **User profiles** - Custom usernames and colored avatars
- **Online presence** - See who's online in each room
- **Responsive design** - Works on desktop and mobile
- **Dark theme** - Easy on the eyes

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Backend:** Supabase (PostgreSQL + Realtime + Auth)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase account and project

### Installation

1. Clone the repository and navigate to the website folder:
```bash
cd website
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. The `.env.local` file is already configured with the Supabase project credentials.

4. Run the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the SQL script in `supabase/seed.sql` in your Supabase SQL Editor to:

1. Create the 20 chat rooms
2. Enable Row Level Security (RLS)
3. Set up authentication policies
4. Enable Realtime for the messages table

### SQL Setup Steps

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/seed.sql`
4. Click **Run**

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and create a new project

3. Connect your GitHub repository

4. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Click **Deploy**

### Supabase Configuration

1. **Enable Email Auth** (if using email/password):
   - Go to Authentication → Providers
   - Enable Email provider

2. **Add redirect URLs**:
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to allowed redirect URLs

3. **Enable Realtime**:
   - Go to Database → Replication
   - Ensure `messages` table is published

## Project Structure

```
website/
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Home page (redirects to chat)
│   ├── chat/
│   │   └── [slug]/
│   │       └── page.tsx    # Chat page for each room
│   └── globals.css         # Global styles
├── components/
│   ├── AuthForm.tsx        # Login/signup form
│   ├── AuthProvider.tsx    # Auth context provider
│   ├── ChatArea.tsx        # Main chat area
│   ├── MessageInput.tsx    # Message input with character limit
│   ├── MessageList.tsx     # Messages with grouping
│   ├── NamePrompt.tsx      # First-time username prompt
│   ├── RoomList.tsx        # List of chat rooms
│   ├── Sidebar.tsx         # Left sidebar with rooms
│   └── UserAvatar.tsx      # Colored avatar component
├── lib/
│   ├── supabase.ts         # Supabase client setup
│   ├── useMessages.ts      # Realtime messages hook
│   ├── usePresence.ts      # Online users hook
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript types
├── supabase/
│   └── seed.sql            # Database seed script
└── .env.local              # Environment variables
```

## Features Detail

### Authentication
- Email + password via Supabase Auth
- Anonymous login (guest users get auto-generated names like "Guest#4821")
- First-time users are prompted to choose a display name
- Profile stored in `profiles` table

### Messaging
- 500 character limit per message
- Enter to send, Shift+Enter for newline
- Auto-scroll to bottom on new messages
- Messages grouped by user (Discord-style)
- URLs auto-linkified
- Relative timestamps ("2m ago")

### Real-time Features
- New messages appear instantly
- Online user count per room
- Supabase Realtime subscription on messages table

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## License

MIT
