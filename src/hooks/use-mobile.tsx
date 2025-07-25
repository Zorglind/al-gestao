import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useSidebarAutoCollapse(isActive: boolean) {
  React.useEffect(() => {
    if (isActive && window.innerWidth < MOBILE_BREAKPOINT) {
      // Auto-collapse sidebar on mobile navigation
      const event = new CustomEvent('sidebar-auto-collapse');
      window.dispatchEvent(event);
    }
  }, [isActive]);
}
