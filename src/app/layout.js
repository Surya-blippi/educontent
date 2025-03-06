import './globals.css';

export const metadata = {
  title: 'Educational Video Generator',
  description: 'Generate educational videos with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}