import Dashboard from "@/components/Dashboard";

interface DashboardPageProps {
  professionalName: string;
  onLogout: () => void;
}

const DashboardPage = ({ professionalName, onLogout }: DashboardPageProps) => {
  return <Dashboard professionalName={professionalName} onLogout={onLogout} />;
};

export default DashboardPage;