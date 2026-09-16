import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do Corretor | Imóveis Taboão",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {children}
    </div>
  );
}