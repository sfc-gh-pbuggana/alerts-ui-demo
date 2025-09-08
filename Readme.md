# Alert Center Demo

This is a demo application showcasing an alert center interface built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Modern alert management interface
- Cloud integration notifications (AWS SNS, Azure Event Grid, Google Pub/Sub)
- Notification settings and preferences
- Responsive design with dark/light theme support
- Built with Next.js 15 and modern React patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alerts-ui-demo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

This application is configured for deployment on Heroku. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Package Manager**: npm

## Project Structure

```
alerts-ui-demo/
├── app/                    # Next.js app router pages
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
├── styles/                 # Global styles
└── ...config files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.