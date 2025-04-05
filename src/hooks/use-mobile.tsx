
import * as React from "react"

const MOBILE_BREAKPOINT = 768

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

// Add a useful breakpoint hook that provides more detailed screen size information
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md')

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) {
        setBreakpoint('xs')
      } else if (width < 768) {
        setBreakpoint('sm') 
      } else if (width < 1024) {
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
