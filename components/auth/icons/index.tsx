"use client"

import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

// Activity Intelligence - Neural network pattern
export function ActivityIntelligenceIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central node */}
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Outer nodes */}
      <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="19" cy="8" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="19" cy="16" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="12" cy="20" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="5" cy="16" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="5" cy="8" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Connection lines */}
      <path d="M12 10V5.5M12 14V18.5" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.6" />
      <path d="M13.7 10.8L17.5 8.5M10.3 13.2L6.5 15.5" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.6" />
      <path d="M13.7 13.2L17.5 15.5M10.3 10.8L6.5 8.5" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.6" />
    </svg>
  )
}

// Strategy Operating System - Layered grid structure
export function StrategyOSIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base layer */}
      <rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.4" />
      {/* Middle layer */}
      <rect x="5" y="9" width="14" height="6" rx="1" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.7" />
      {/* Top layer */}
      <rect x="7" y="4" width="10" height="6" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Connection dots */}
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  )
}

// Psychology Mapping - Mind pattern
export function PsychologyMappingIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brain outline simplified */}
      <path
        d="M12 4C8 4 5 7 5 10C5 12 6 13.5 7 14.5V19C7 19.5 7.5 20 8 20H16C16.5 20 17 19.5 17 19V14.5C18 13.5 19 12 19 10C19 7 16 4 12 4Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Neural pathways */}
      <path d="M9 10C9 10 10 11 12 11C14 11 15 10 15 10" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.6" />
      <path d="M10 14H14" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.6" />
      {/* Central point */}
      <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

// Mentor Intelligence - Guidance beacon
export function MentorIntelligenceIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Beacon base */}
      <path d="M8 20H16" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M10 20V16H14V20" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Beacon body */}
      <path d="M12 16V8" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Light emanation */}
      <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Signal waves */}
      <path d="M7 6C7 6 8 4 12 4C16 4 17 6 17 6" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.5" />
      <path d="M5 8C5 8 6 3 12 3C18 3 19 8 19 8" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.3" />
    </svg>
  )
}

// Secure Environment - Shield with layers
export function SecureEnvironmentIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer shield */}
      <path
        d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21C16.6 20.5 20 16.4 20 12V7L12 3Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Inner shield layer */}
      <path
        d="M12 6L7 8.5V12C7 14.8 9.2 17.3 12 17.8C14.8 17.3 17 14.8 17 12V8.5L12 6Z"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.75}
        opacity="0.6"
      />
      {/* Core */}
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth={strokeWidth * 0.75} />
    </svg>
  )
}

// AI Copilot - Intelligent assistant
export function AICopilotIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main form */}
      <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Eyes - representing perception */}
      <circle cx="9.5" cy="9" r="1" fill="currentColor" />
      <circle cx="14.5" cy="9" r="1" fill="currentColor" />
      {/* Processing indicator */}
      <path d="M9 12.5C9 12.5 10 14 12 14C14 14 15 12.5 15 12.5" stroke="currentColor" strokeWidth={strokeWidth * 0.75} />
      {/* Data streams */}
      <path d="M6 18L9 15" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.5" />
      <path d="M18 18L15 15" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.5" />
      <path d="M12 16V20" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.5" />
    </svg>
  )
}

// Access Key - Entry symbol
export function AccessKeyIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Key head */}
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth={strokeWidth * 0.75} />
      {/* Key shaft */}
      <path d="M11 11L20 20" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Key teeth */}
      <path d="M16 16L18 14" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M18 18L20 16" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// System Status - Pulse indicator
export function SystemStatusIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Monitor frame */}
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Pulse line */}
      <path
        d="M6 11H9L10 8L12 14L14 11H18"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stand */}
      <path d="M8 18H16" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 18V21" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Data Flow - Stream indicator
export function DataFlowIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flow lines */}
      <path d="M4 6H12" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.4" />
      <path d="M4 12H16" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.7" />
      <path d="M4 18H20" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Flow nodes */}
      <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.4" />
      <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.7" />
      <circle cx="22" cy="18" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Arrows */}
      <path d="M10 4L12 6L10 8" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.4" />
      <path d="M14 10L16 12L14 14" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.7" />
      <path d="M18 16L20 18L18 20" stroke="currentColor" strokeWidth={strokeWidth * 0.75} />
    </svg>
  )
}

// Verification Check - Authenticated
export function VerificationIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon frame */}
      <path
        d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Check mark */}
      <path
        d="M8 12L11 15L16 9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Email Icon - Communication channel
export function EmailIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Envelope */}
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Flap lines */}
      <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Lock Icon - Security
export function LockIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lock body */}
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Shackle */}
      <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* Keyhole */}
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      <path d="M12 16.5V18" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Eye Icon - Visibility toggle
export function EyeIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Eye outline */}
      <path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Pupil */}
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Eye Off Icon - Hidden
export function EyeOffIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Partial eye */}
      <path
        d="M17.94 17.94C16.23 19.24 14.18 20 12 20C5 20 2 12 2 12C3.24 9.68 5.06 7.76 7.22 6.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M9.88 9.88C10.42 9.33 11.17 9 12 9C13.66 9 15 10.34 15 12C15 12.83 14.67 13.58 14.12 14.12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 12C22 12 19 19 12 19"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.5"
      />
      {/* Strike through */}
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Arrow Right Icon
export function ArrowRightIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12H19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14 7L19 12L14 17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Loader Icon - Processing
export function LoaderIcon({ className, size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.2" />
      <path
        d="M12 3C16.97 3 21 7.03 21 12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ArchioAI Logo Mark
export function ArchioLogoMark({ className, size = 32 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner structure */}
      <path
        d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Core */}
      <circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Central dot */}
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  )
}
