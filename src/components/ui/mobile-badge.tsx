
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const mobileBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-500 text-white",
        secondary: "border-transparent bg-orange-100 text-orange-600",
        outline: "border-gray-300 bg-white text-gray-700",
        destructive: "border-transparent bg-red-100 text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface MobileBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mobileBadgeVariants> {}

function MobileBadge({ className, variant, ...props }: MobileBadgeProps) {
  return (
    <div className={cn(mobileBadgeVariants({ variant }), className)} {...props} />
  )
}

export { MobileBadge, mobileBadgeVariants }
