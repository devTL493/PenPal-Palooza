
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

/* ----------------- Context ----------------- */

interface SidebarContextValue {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar components must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultExpanded?: boolean
}

const SidebarProvider = ({
  children,
  defaultExpanded = true,
}: SidebarProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isMobile = useMobile()

  // Collapse sidebar by default on mobile
  React.useEffect(() => {
    if (isMobile) {
      setExpanded(false)
    } else {
      setMobileOpen(false)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

/* ----------------- Components ----------------- */

// Root component
const sidebarVariants = cva(
  "h-screen bg-sidebar border-r border-sidebar-border shadow-sm z-40 transition-all duration-300 ease-in-out data-[expanded=false]:border-0",
  {
    variants: {
      expanded: {
        true: "w-64 data-[mobile=true]:fixed",
        false: "w-0 sm:w-16 data-[mobile=true]:fixed",
      },
      mobile: {
        true: "absolute",
        false: "relative",
      },
    },
  }
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Sidebar = ({ className, ...props }: SidebarProps) => {
  const { expanded, mobileOpen } = useSidebarContext()
  const isMobile = useMobile()
  
  // Determine if sidebar should be visible
  const isVisible = isMobile ? mobileOpen : true
  const expandState = isMobile ? mobileOpen : expanded
  
  if (!isVisible) return null
  
  return (
    <aside
      className={cn(sidebarVariants({ expanded: expandState, mobile: isMobile }), className)}
      data-expanded={expandState ? "true" : "false"}
      data-mobile={isMobile ? "true" : "false"}
      {...props}
    />
  )
}

// Header component
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SidebarHeader = ({ className, ...props }: SidebarHeaderProps) => {
  const { expanded } = useSidebarContext()
  
  return (
    <div
      className={cn(
        "flex items-center h-14 px-4 border-b border-sidebar-border",
        expanded ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    />
  )
}

// Content container
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SidebarContent = ({ className, ...props }: SidebarContentProps) => {
  return (
    <div
      className={cn("flex flex-col space-y-1 p-2 overflow-y-auto", className)}
      {...props}
    />
  )
}

// Group components
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SidebarGroup = ({ className, ...props }: SidebarGroupProps) => {
  return (
    <div
      className={cn("flex flex-col space-y-1", className)}
      {...props}
    />
  )
}

// Group label
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SidebarGroupLabel = ({ className, ...props }: SidebarGroupLabelProps) => {
  const { expanded } = useSidebarContext()
  
  if (!expanded) return null
  
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-sidebar-foreground/60",
        className
      )}
      {...props}
    />
  )
}

// Group content
interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SidebarGroupContent = ({ className, ...props }: SidebarGroupContentProps) => {
  return <div className={cn("space-y-1", className)} {...props} />
}

// Menu components
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string
}

const SidebarMenu = ({ className, ...props }: SidebarMenuProps) => {
  return (
    <ul
      className={cn("list-none m-0 p-0 space-y-1", className)}
      {...props}
    />
  )
}

// Menu item
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string
  active?: boolean
}

const SidebarMenuItem = ({
  className,
  active = false,
  ...props
}: SidebarMenuItemProps) => {
  return (
    <li
      className={cn(className)}
      data-active={active ? "true" : "false"}
      {...props}
    />
  )
}

// Menu button
interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

const sidebarMenuButtonVariants = cva(
  "flex items-center text-sidebar-foreground hover:text-sidebar-foreground/80 rounded-md transition-colors group w-full",
  {
    variants: {
      variant: {
        default:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
        ghost:
          "hover:bg-transparent hover:text-sidebar-primary data-[active=true]:bg-transparent data-[active=true]:text-sidebar-primary",
      },
      size: {
        default: "h-10 px-2 py-1.5 text-sm",
        sm: "h-8 px-1.5 py-1 text-xs",
        lg: "h-12 px-3 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const { expanded } = useSidebarContext()
    
    const Comp = asChild ? React.Fragment : "button"
    
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          expanded ? "justify-start" : "justify-center",
          !expanded && "py-2.5",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

// Footer component
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SidebarFooter = ({ className, ...props }: SidebarFooterProps) => {
  const { expanded } = useSidebarContext()
  
  return (
    <div
      className={cn(
        "flex items-center h-14 px-4 border-t border-sidebar-border mt-auto",
        expanded ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    />
  )
}

// Sidebar trigger button
interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const SidebarTrigger = ({ className, ...props }: SidebarTriggerProps) => {
  const { expanded, setExpanded, mobileOpen, setMobileOpen } = useSidebarContext()
  const isMobile = useMobile()
  
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setExpanded(!expanded)
    }
  }
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  )
}

// Export all components
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebarContext,
}
