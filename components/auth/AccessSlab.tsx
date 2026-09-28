"use client"

import { forwardRef, useState, useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  ArchioLogoMark,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  LoaderIcon,
  VerificationIcon,
  EmailIcon,
  LockIcon,
} from "./icons"
import { SURFACE, ACCENT, GLOW, GRADIENT, ELEVATION, RADIUS } from "@/components/mtf/mtf-theme"

// Types for interaction state management
export type InteractionState =
  | "idle"
  | "hovering"
  | "email-focus"
  | "password-focus"
  | "confirm-focus"
  | "cta-hover"
  | "submitting"
  | "success"

export type AuthMode = "login" | "register" | "forgot-password" | "reset-password"

interface AccessSlabProps {
  mode: AuthMode
  onInteractionChange?: (state: InteractionState) => void
  onSubmit?: (data: { email: string; password: string; confirmPassword?: string }) => Promise<void>
  error?: string
  successMessage?: string
  className?: string
}

interface PremiumInputProps {
  type: "email" | "password" | "text"
  label: string
  systemLabel: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  error?: string
  isValid?: boolean
  disabled?: boolean
  showPasswordToggle?: boolean
  autoComplete?: string
}

// ── Scanning line animation for active fields ──
function ScanLine({ active, color = "purple" }: { active: boolean; color?: "purple" | "emerald" | "rose" }) {
  const colors = {
    purple: `rgba(${ACCENT.purple.rgb}, 0.12)`,
    emerald: `rgba(${ACCENT.emerald.rgb}, 0.10)`,
    rose: `rgba(${ACCENT.rose.rgb}, 0.10)`,
  }
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: "opacity 300ms" }}
    >
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors[color]}, transparent)`,
          animation: active ? "scan-field 2.4s cubic-bezier(0.33, 1, 0.68, 1) infinite" : "none",
        }}
      />
    </div>
  )
}

// ── Pulse ring for the status dot ──
function PulseRing({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="relative">
      <div
        className="w-1.5 h-1.5 rounded-full transition-all duration-500"
        style={{
          backgroundColor: color,
          boxShadow: active ? `0 0 8px ${color}` : "none",
        }}
      />
      {active && (
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: color,
            opacity: 0.3,
            animationDuration: "2s",
          }}
        />
      )}
    </div>
  )
}

// ── Premium Input with focus ritual ──
const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      type,
      label,
      systemLabel,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      error,
      isValid,
      disabled,
      showPasswordToggle,
      autoComplete,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

    const handleFocus = () => {
      setIsFocused(true)
      setHasInteracted(true)
      onFocus?.()
    }

    const handleBlur = () => {
      setIsFocused(false)
      onBlur?.()
    }

    const inputType = type === "password" && showPassword ? "text" : type

    return (
      <div className="relative group">
        {/* Label row */}
        <div className="flex items-center justify-between mb-2.5">
          <label
            className={cn(
              "text-[11px] font-mono tracking-[0.08em] uppercase transition-all duration-300",
              isFocused ? "text-slate-300" : "text-slate-500",
              error && "text-rose-400/70"
            )}
          >
            {label}
          </label>
          <div className="flex items-center gap-2">
            {hasInteracted && isValid && !isFocused && value.length > 0 && (
              <VerificationIcon size={10} className="text-emerald-500/50" />
            )}
            <span
              className={cn(
                "text-[8px] font-mono tracking-[0.15em] transition-all duration-300",
                isFocused ? "text-purple-400/50" : "text-slate-700",
              )}
            >
              {systemLabel}
            </span>
          </div>
        </div>

        {/* Input container */}
        <div className="relative">
          {/* Left edge indicator */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-200",
              !isFocused && "bg-transparent",
              isFocused && !error && !isValid && `bg-purple-400/30`,
              isFocused && isValid && "bg-emerald-500/40",
              error && "bg-rose-400/40"
            )}
            style={{
              transform: isFocused ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "center",
              transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
              borderRadius: "1px",
            }}
          />

          {/* Top edge glow on focus */}
          <div
            className="absolute top-0 left-2 right-2 h-px transition-all duration-300"
            style={{
              background: isFocused
                ? error
                  ? `linear-gradient(90deg, transparent, rgba(${ACCENT.rose.rgb},0.12), transparent)`
                  : isValid
                    ? `linear-gradient(90deg, transparent, rgba(${ACCENT.emerald.rgb},0.08), transparent)`
                    : `linear-gradient(90deg, transparent, rgba(${ACCENT.purple.rgb},0.1), transparent)`
                : "none",
            }}
          />

          {/* Scan line animation */}
          <ScanLine
            active={isFocused}
            color={error ? "rose" : isValid ? "emerald" : "purple"}
          />

          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={cn(
              "w-full h-11 px-4 pl-5",
              "text-[13px] text-slate-200 placeholder:text-slate-600/60",
              "font-mono tracking-wide",
              "outline-none transition-all duration-200",
              "border",
              // Base
              "bg-[rgba(12,14,26,0.85)] border-[rgba(139,92,246,0.08)]",
              // Focus
              isFocused && "bg-[rgba(16,19,34,0.92)] border-[rgba(139,92,246,0.15)]",
              isFocused && `shadow-[0_0_20px_rgba(${ACCENT.purple.rgb},0.06)]`,
              // Valid + focused
              isValid && isFocused && `border-[rgba(${ACCENT.emerald.rgb},0.15)]`,
              isValid && isFocused && `shadow-[0_0_20px_rgba(${ACCENT.emerald.rgb},0.04)]`,
              // Error
              error && `border-[rgba(${ACCENT.rose.rgb},0.2)]`,
              // Disabled
              disabled && "opacity-40 cursor-not-allowed",
              // Caret
              "caret-purple-400/60"
            )}
            style={{ borderRadius: RADIUS.badge }}
          />

          {/* Right-side controls */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "p-1 transition-all duration-200",
                  "text-slate-600 hover:text-purple-400/70",
                  "focus:outline-none"
                )}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
              </button>
            )}
            {isValid && !isFocused && value.length > 0 && (
              <VerificationIcon size={14} className="text-emerald-500/50" />
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-[10px] font-mono text-rose-400/70 tracking-wide">
            {error}
          </p>
        )}
      </div>
    )
  }
)
PremiumInput.displayName = "PremiumInput"

// ── MODE CONFIGURATION ──
const MODE_CONFIG: Record<AuthMode, {
  title: string
  subtitle: string
  operatorLabel: string
  ctaText: string
  ctaSubmittingText: string
  ctaSuccessText: string
  successIcon: "check" | "email" | "lock"
}> = {
  login: {
    title: "Authenticate",
    subtitle: "Enter credentials to access the operational environment.",
    operatorLabel: "Operator Access",
    ctaText: "ENTER SYSTEM",
    ctaSubmittingText: "VERIFYING CREDENTIALS",
    ctaSuccessText: "ACCESS GRANTED",
    successIcon: "check",
  },
  register: {
    title: "Initialize Access",
    subtitle: "Create operator credentials to connect with the intelligence system.",
    operatorLabel: "New Operator",
    ctaText: "INITIALIZE ACCESS",
    ctaSubmittingText: "CREATING IDENTITY",
    ctaSuccessText: "IDENTITY CREATED",
    successIcon: "check",
  },
  "forgot-password": {
    title: "Recovery Protocol",
    subtitle: "Submit your operator email to receive an access key reset link.",
    operatorLabel: "Key Recovery",
    ctaText: "TRANSMIT RESET LINK",
    ctaSubmittingText: "LOCATING IDENTITY",
    ctaSuccessText: "LINK TRANSMITTED",
    successIcon: "email",
  },
  "reset-password": {
    title: "Rekey Access",
    subtitle: "Enter a new access key to restore operational status.",
    operatorLabel: "Credential Reset",
    ctaText: "INSTALL NEW KEY",
    ctaSubmittingText: "ENCRYPTING KEY",
    ctaSuccessText: "KEY INSTALLED",
    successIcon: "lock",
  },
}

// ── Main Access Slab ──
export function AccessSlab({
  mode,
  onInteractionChange,
  onSubmit,
  error,
  successMessage,
  className,
}: AccessSlabProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const config = MODE_CONFIG[mode]

  // Which fields are visible per mode
  const showEmail = mode === "login" || mode === "register" || mode === "forgot-password"
  const showPassword = mode === "login" || mode === "register" || mode === "reset-password"
  const showConfirmPassword = mode === "register" || mode === "reset-password"
  const showPasswordRequirements = mode === "register" || mode === "reset-password"
  const showForgotLink = mode === "login"

  // Password requirement checks
  const hasMinLength = password.length >= 12
  const hasUppercase = /[A-Z]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = showPassword ? hasMinLength && hasUppercase && hasSpecialChar : true
  const isConfirmValid = showConfirmPassword ? password === confirmPassword && confirmPassword.length > 0 : true

  // Can submit logic per mode
  const canSubmit = (() => {
    if (mode === "forgot-password") return isEmailValid
    if (mode === "reset-password") return isPasswordValid && isConfirmValid
    if (mode === "register") return isEmailValid && isPasswordValid && isConfirmValid
    return isEmailValid && password.length > 0 // login
  })()

  const updateInteractionState = useCallback(
    (state: InteractionState) => {
      onInteractionChange?.(state)
    },
    [onInteractionChange]
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!focusedField && !isSubmitting) updateInteractionState("hovering")
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!focusedField && !isSubmitting) updateInteractionState("idle")
  }

  const handleFieldFocus = (field: string) => {
    setFocusedField(field)
    if (field === "email") updateInteractionState("email-focus")
    else if (field === "password") updateInteractionState("password-focus")
    else if (field === "confirmPassword") updateInteractionState("confirm-focus")
  }

  const handleFieldBlur = () => {
    setFocusedField(null)
    updateInteractionState(isHovered ? "hovering" : "idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    updateInteractionState("submitting")
    setFieldErrors({})

    try {
      await onSubmit?.({
        email,
        password,
        ...(showConfirmPassword ? { confirmPassword } : {}),
      })
      setIsSuccess(true)
      updateInteractionState("success")
    } catch (err) {
      setFieldErrors({
        form: err instanceof Error ? err.message : "Operation failed. Please try again.",
      })
      setIsSubmitting(false)
      updateInteractionState("idle")
    }
  }

  // Status dot color
  const statusColor = isSuccess
    ? ACCENT.emerald.hex
    : isSubmitting
      ? ACCENT.blue.hex
      : focusedField
        ? ACCENT.purple.hex
        : "rgb(51, 65, 85)"

  return (
    <div
      className={cn(
        "relative w-full max-w-[420px]",
        "transition-opacity duration-700",
        mounted ? "opacity-100" : "opacity-0",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Global animation keyframes */}
      <style jsx>{`
        @keyframes scan-field {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer-edge {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: ${ELEVATION.card}, ${GLOW.low(ACCENT.emerald.rgb)}; }
          50% { box-shadow: ${ELEVATION.card}, ${GLOW.med(ACCENT.emerald.rgb)}; }
        }
      `}</style>

      {/* Card container -- MTF rounded style */}
      <div
        className={cn(
          "relative px-8 py-9",
          "transition-all duration-500",
        )}
        style={{
          borderRadius: RADIUS.card,
          background: isHovered && !focusedField
            ? SURFACE.cardHover
            : focusedField
              ? SURFACE.cardHover
              : SURFACE.card,
          boxShadow: isSuccess
            ? "none"
            : focusedField
              ? `${ELEVATION.cardHover}, ${GLOW.low(ACCENT.purple.rgb)}`
              : isHovered
                ? ELEVATION.cardHover
                : ELEVATION.card,
          animation: isSuccess ? "success-glow 3s ease-in-out infinite" : "none",
        }}
      >
        {/* Top accent line -- MTF card accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-all duration-500 overflow-hidden"
          style={{
            borderRadius: `${RADIUS.card} ${RADIUS.card} 0 0`,
            background: focusedField
              ? GRADIENT.cardAccent(ACCENT.purple.rgb)
              : isSuccess
                ? GRADIENT.cardAccent(ACCENT.emerald.rgb)
                : `linear-gradient(90deg, transparent 10%, rgba(${ACCENT.purple.rgb},0.08) 50%, transparent 90%)`,
          }}
        />

        {/* Shimmer edge on hover */}
        {isHovered && !focusedField && !isSubmitting && (
          <div
            className="absolute top-0 left-0 right-0 h-px overflow-hidden"
            style={{ borderRadius: `${RADIUS.card} ${RADIUS.card} 0 0` }}
          >
            <div
              className="h-full w-1/3"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(${ACCENT.purple.rgb},0.12), transparent)`,
                animation: "shimmer-edge 3s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ArchioLogoMark
              size={24}
              className={cn(
                "transition-all duration-500",
                "text-purple-500/40",
                focusedField && "text-purple-400/70",
                isSuccess && "text-emerald-400/80",
                isSubmitting && "animate-pulse",
              )}
            />
            <div
              className="h-3 w-px"
              style={{ background: `rgba(${ACCENT.purple.rgb},0.12)` }}
            />
            <span className="text-[9px] font-mono tracking-[0.18em] text-slate-600 uppercase">
              {config.operatorLabel}
            </span>
            {/* Live status dot */}
            <div className="flex-1" />
            <PulseRing
              active={isSubmitting || isSuccess || !!focusedField}
              color={statusColor}
            />
          </div>

          <h1 className="text-[17px] font-medium text-slate-100 tracking-tight mb-2">
            {config.title}
          </h1>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Divider seam */}
        <div
          className="h-px mb-7 transition-all duration-500"
          style={{
            background: focusedField
              ? `linear-gradient(90deg, rgba(${ACCENT.purple.rgb},0.12), rgba(${ACCENT.purple.rgb},0.04))`
              : SURFACE.divider !== "rgba(139,92,246,0.06)"
                ? `linear-gradient(90deg, ${SURFACE.divider}, transparent)`
                : `linear-gradient(90deg, rgba(${ACCENT.purple.rgb},0.06), transparent)`,
          }}
        />

        {/* Success state overlay */}
        {isSuccess && successMessage && (
          <div
            className="mb-6 flex items-start gap-3 px-4 py-3 text-[11px] font-mono text-emerald-400/80 tracking-wide leading-relaxed"
            style={{
              borderRadius: RADIUS.badge,
              border: `1px solid rgba(${ACCENT.emerald.rgb},0.12)`,
              background: `rgba(${ACCENT.emerald.rgb},0.04)`,
            }}
          >
            <VerificationIcon size={14} className="text-emerald-400/60 mt-px flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          {showEmail && (
            <PremiumInput
              type="email"
              label="Operator Email"
              systemLabel="IDENTITY"
              placeholder="name@organization.com"
              value={email}
              onChange={setEmail}
              onFocus={() => handleFieldFocus("email")}
              onBlur={handleFieldBlur}
              error={fieldErrors.email}
              isValid={isEmailValid && email.length > 0}
              disabled={isSubmitting || isSuccess}
              autoComplete="email"
            />
          )}

          {/* Password field */}
          {showPassword && (
            <div>
              <PremiumInput
                type="password"
                label={mode === "reset-password" ? "New Access Key" : "Access Key"}
                systemLabel={mode === "reset-password" ? "NEW CREDENTIAL" : "CREDENTIAL"}
                placeholder={mode === "reset-password" ? "Enter new access key" : "Enter access key"}
                value={password}
                onChange={setPassword}
                onFocus={() => handleFieldFocus("password")}
                onBlur={handleFieldBlur}
                error={fieldErrors.password}
                isValid={showPasswordRequirements ? isPasswordValid : password.length > 0}
                disabled={isSubmitting || isSuccess}
                showPasswordToggle
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              {/* Password requirements -- animated bars */}
              {showPasswordRequirements && password.length > 0 && (
                <div className="mt-3 space-y-2">
                  {/* Strength bar */}
                  <div className="flex gap-1">
                    {[hasMinLength, hasUppercase, hasSpecialChar].map((met, i) => (
                      <div
                        key={i}
                        className="h-[2px] flex-1 transition-all duration-500"
                        style={{
                          backgroundColor: met ? `rgba(${ACCENT.emerald.rgb},0.6)` : `rgba(51,65,85,0.4)`,
                          boxShadow: met ? GLOW.low(ACCENT.emerald.rgb) : "none",
                          borderRadius: "1px",
                        }}
                      />
                    ))}
                  </div>
                  {/* Requirement labels */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {[
                      { met: hasMinLength, label: "12+ CHARS" },
                      { met: hasUppercase, label: "UPPERCASE" },
                      { met: hasSpecialChar, label: "SPECIAL CHAR" },
                    ].map(({ met, label }) => (
                      <span
                        key={label}
                        className={cn(
                          "text-[9px] font-mono tracking-[0.1em] flex items-center gap-1.5 transition-all duration-300",
                          met ? "text-emerald-400/70" : "text-slate-600"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block w-1 h-1 rounded-full transition-all duration-300",
                          )}
                          style={{
                            background: met ? `rgba(${ACCENT.emerald.rgb},0.7)` : "rgb(51,65,85)",
                            boxShadow: met ? `0 0 4px rgba(${ACCENT.emerald.rgb},0.3)` : "none",
                          }}
                        />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Forgot password link */}
              {showForgotLink && (
                <div className="mt-3 text-right">
                  <a
                    href="/forgot-password"
                    className="text-[10px] font-mono tracking-[0.08em] text-slate-600 hover:text-purple-400/70 transition-colors duration-200"
                  >
                    FORGOT ACCESS KEY?
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Confirm password field */}
          {showConfirmPassword && (
            <PremiumInput
              type="password"
              label="Confirm Access Key"
              systemLabel="VERIFICATION"
              placeholder="Re-enter access key"
              value={confirmPassword}
              onChange={setConfirmPassword}
              onFocus={() => handleFieldFocus("confirmPassword")}
              onBlur={handleFieldBlur}
              error={fieldErrors.confirmPassword}
              isValid={isConfirmValid}
              disabled={isSubmitting || isSuccess}
              showPasswordToggle
              autoComplete="new-password"
            />
          )}

          {/* Form-level error */}
          {(error || fieldErrors.form) && (
            <div
              className="flex items-start gap-3 px-4 py-3 text-[11px] font-mono text-rose-400/80 tracking-wide leading-relaxed"
              style={{
                borderRadius: RADIUS.badge,
                border: `1px solid rgba(${ACCENT.rose.rgb},0.12)`,
                background: `rgba(${ACCENT.rose.rgb},0.04)`,
              }}
            >
              <span className="text-rose-400/50 mt-px">{"///"}</span>
              <span>{error || fieldErrors.form}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isSuccess}
              onMouseEnter={() => {
                if (canSubmit && !isSubmitting && !isSuccess) updateInteractionState("cta-hover")
              }}
              onMouseLeave={() => {
                if (!isSubmitting && !isSuccess) {
                  updateInteractionState(
                    focusedField
                      ? focusedField === "email"
                        ? "email-focus"
                        : focusedField === "confirmPassword"
                          ? "confirm-focus"
                          : "password-focus"
                      : isHovered
                        ? "hovering"
                        : "idle"
                  )
                }
              }}
              className={cn(
                "relative w-full h-[46px] group/cta",
                "transition-all duration-300",
                "text-[12px] font-mono tracking-[0.15em]",
                "outline-none overflow-hidden",
                // Disabled
                (!canSubmit || isSubmitting) && !isSuccess && "opacity-40 cursor-not-allowed",
              )}
              style={{
                borderRadius: RADIUS.pill,
                border: isSuccess
                  ? `1px solid rgba(${ACCENT.emerald.rgb},0.2)`
                  : canSubmit && !isSubmitting
                    ? `1px solid rgba(${ACCENT.purple.rgb},0.15)`
                    : `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
                background: isSuccess
                  ? `rgba(${ACCENT.emerald.rgb},0.06)`
                  : SURFACE.control,
                color: isSuccess
                  ? ACCENT.emerald.hex
                  : canSubmit
                    ? "rgb(203,213,225)"
                    : "rgb(100,116,139)",
                boxShadow: canSubmit && !isSubmitting && !isSuccess
                  ? `0 0 20px rgba(${ACCENT.purple.rgb},0.04)`
                  : "none",
              }}
            >
              {/* Hover edge shimmer */}
              {canSubmit && !isSubmitting && !isSuccess && (
                <div
                  className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
                  style={{ borderRadius: RADIUS.pill }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(${ACCENT.purple.rgb},0.15), transparent)`,
                      animation: "shimmer-edge 2s ease-in-out infinite",
                    }}
                  />
                </div>
              )}

              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {isSubmitting ? (
                  <>
                    <LoaderIcon size={14} />
                    <span>{config.ctaSubmittingText}</span>
                  </>
                ) : isSuccess ? (
                  <>
                    {config.successIcon === "email" ? (
                      <EmailIcon size={14} />
                    ) : config.successIcon === "lock" ? (
                      <LockIcon size={14} />
                    ) : (
                      <VerificationIcon size={14} />
                    )}
                    <span>{config.ctaSuccessText}</span>
                  </>
                ) : (
                  <>
                    <span>{config.ctaText}</span>
                    <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                  </>
                )}
              </span>

              {/* Loading bar */}
              {isSubmitting && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden"
                  style={{ borderRadius: `0 0 ${RADIUS.pill} ${RADIUS.pill}` }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: "30%",
                      background: `rgba(${ACCENT.purple.rgb},0.4)`,
                      animation: "loading-bar 1.8s cubic-bezier(0.33, 1, 0.68, 1) infinite",
                    }}
                  />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer navigation */}
        <div
          className="mt-7 pt-5"
          style={{
            borderTop: `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            {mode === "login" && (
              <p className="text-[11px] text-slate-600 font-mono tracking-wide">
                {"New operator? "}
                <a href="/register" className="text-purple-400/60 hover:text-purple-400 transition-colors duration-200">
                  Request access
                </a>
              </p>
            )}
            {mode === "register" && (
              <p className="text-[11px] text-slate-600 font-mono tracking-wide">
                {"Already have access? "}
                <a href="/login" className="text-purple-400/60 hover:text-purple-400 transition-colors duration-200">
                  Authenticate
                </a>
              </p>
            )}
            {mode === "forgot-password" && (
              <p className="text-[11px] text-slate-600 font-mono tracking-wide">
                {"Remember your key? "}
                <a href="/login" className="text-purple-400/60 hover:text-purple-400 transition-colors duration-200">
                  Return to access
                </a>
              </p>
            )}
            {mode === "reset-password" && (
              <p className="text-[11px] text-slate-600 font-mono tracking-wide">
                {"Key installed? "}
                <a href="/login" className="text-purple-400/60 hover:text-purple-400 transition-colors duration-200">
                  Authenticate now
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sub-card legal */}
      <p className="text-center text-[9px] font-mono text-slate-700 mt-5 tracking-[0.08em]">
        Secured by institutional-grade encryption protocols.
      </p>
    </div>
  )
}
