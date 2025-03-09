# Personal Finance Tracker v0.dev

## Overview

**Personal Finance Tracker** is a local-first, minimalist expense tracking app designed for **quick and effortless logging of daily transactions**. It provides an intuitive dashboard with **daily, weekly, and monthly spending insights**, all on a single page. 

This tool is **strictly for personal use**, supporting both **SGD and USD** currencies, with real-time USD-to-SGD conversion at the time of entry. No banking integrations or budgeting features—just pure, simple tracking.

## Features

### Core Features
✅ **Instant Transaction Logging** – Add expenses in **SGD or USD**, automatically converting USD to SGD.  
✅ **Unified Dashboard** – View **daily, weekly, and monthly** spending at a glance.  
✅ **Tagging System** – Assign multiple tags to transactions for better organization.  
✅ **Quick Edits & Deletions** – Modify or remove transactions effortlessly.  
✅ **Minimalist UI** – A clean, **aesthetically pleasing** interface inspired by interior design elements.  

### Non-Goals  
❌ **No Budgeting Tools** – This app **does not** provide budgeting advice or financial planning.  
❌ **No Bank Integrations** – No account linking, ensuring **complete privacy**.  
❌ **No Multi-User Support** – Built for **single-user**, local-first use.  

## Tech Stack

- **Frontend:** Next.js 15 (React) + Tailwind CSS  
- **State Management:** TanStack Query (React Query)  
- **Database:** PostgreSQL (via Supabase)  
- **Backend:** Supabase (for data storage)  
- **Styling:** Tailwind CSS + Framer Motion  
- **Deployment:** Vercel  
- **Currency API:** Fetches real-time **USD to SGD** rates at the time of entry (API TBD).  

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
