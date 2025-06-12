export const DefaultHeader = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};