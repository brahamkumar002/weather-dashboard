
function WeatherCard({ icon, title, value, description }) {
    return (
        <div className="group rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/15 sm:p-8">

            {/* Weather Icon */}
            <div className="flex items-start justify-between gap-3">
                <span className="text-4xl sm:text-5xl" aria-hidden="true">
                    {icon}
                </span>

                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                    Current
                </span>
            </div>

            {/* Weather Metric Name */}
            <h3 className="mt-5 text-base font-medium text-gray-300 sm:text-lg">
                {title}
            </h3>

            {/* Weather Metric Value */}
            <p className="mt-2 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {value ?? "N/A"}
            </p>

            {/* Weather Description */}
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {description}
            </p>

        </div>
    );
}

export default WeatherCard;
