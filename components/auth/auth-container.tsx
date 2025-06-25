interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthContainer({
  children,
  title,
  subtitle,
}: AuthContainerProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/80 to-blue-600/80" />
        <img
          src="/auth-background.jpg"
          alt="FPT Background"
          className="object-cover w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <img
            src="/placeholder-logo.svg"
            alt="FPT Logo"
            className="w-32 h-32 mb-8"
          />
          <h1 className="text-4xl font-bold text-center mb-4">
            FPT Alumni Connection
          </h1>
          <p className="text-xl text-center opacity-90">
            Connect, Share, and Grow with the FPT Community
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          </div>

          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
