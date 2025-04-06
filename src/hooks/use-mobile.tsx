
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const SMALL_MOBILE_BREAKPOINT = 320
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Check immediately
    checkMobile()
    
    // Set up event listener for window resize
    window.addEventListener("resize", checkMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Enhanced breakpoint hook that provides more detailed screen size information
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md')

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < SMALL_MOBILE_BREAKPOINT) {
        setBreakpoint('xs')
      } else if (width < MOBILE_BREAKPOINT) {
        setBreakpoint('sm') 
      } else if (width < TABLET_BREAKPOINT) {
        setBreakpoint('md')
      } else if (width < 1280) {
        setBreakpoint('lg')
      } else if (width < 1536) {
        setBreakpoint('xl')
      } else {
        setBreakpoint('2xl')
      }
    }
    
    // Initial check
    checkBreakpoint()
    
    // Set up event listener
    window.addEventListener("resize", checkBreakpoint)
    
    // Clean up
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}

// New hooks for specific breakpoints
export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkSmallMobile = () => setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT)
    checkSmallMobile()
    window.addEventListener("resize", checkSmallMobile)
    return () => window.removeEventListener("resize", checkSmallMobile)
  }, [])

  return isSmallMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    checkTablet()
    window.addEventListener("resize", checkTablet)
    return () => window.removeEventListener("resize", checkTablet)
  }, [])

  return isTablet
}
