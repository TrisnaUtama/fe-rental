import { Link, useLocation } from "react-router-dom";

export const MenuBar = ({
  menuBar,
}: {
  menuBar: { path: string; icon: React.ReactNode; label: string }[];
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {Object.entries(menuBar).map(([key, value]) => {
        const isActive = pathname === value.path;

        return (
          <div className="flex flex-col items-center group" key={key}>
            <Link
              to={value.path}
              className={`flex items-center justify-center text-center p-4 rounded-xl border transition-all duration-300 group-hover:scale-105
                ${
                  isActive
                    ? "bg-blue-500 border-blue-500 text-white shadow-xl -translate-y-1"
                    : "bg-white border-gray-100 text-gray-800 shadow-lg hover:bg-blue-500 hover:border-blue-500 hover:text-white hover:shadow-xl hover:-translate-y-1"
                }`}
            >
              <div className="h-6 w-6">{value.icon}</div>
            </Link>
            <p
              className={`mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-500 transition-colors ${
                isActive && "text-blue-500"
              }`}
            >
              {value.label}
            </p>
          </div>
        );
      })}
    </>
  );
};
