import { ConnectionStatusButton } from "./components/connection-status-button"
import { ConnectionToggleButton } from "./components/connection-toggle-button"
import { PinoramaLogo } from "./components/pinorama-logo"
import { ThemeToggleButton } from "./components/theme-toggle-button"

export function TitleBar() {
  return (
    <div className="border-b bg-muted/20">
      <div className="relative flex justify-between text-sm h-full px-3">
        {/* Left */}
        <div className="flex items-center">
          <PinoramaLogo />
        </div>

        {/* Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex h-full items-center">
          <ConnectionStatusButton />
        </div>

        {/* Right */}
        <div className="flex items-center space-x-1.5">
          <ThemeToggleButton />
          <ConnectionToggleButton />
        </div>
      </div>
    </div>
  )
}
