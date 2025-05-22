import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TreeConnectorProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  gender?: "male" | "female";
  animated?: boolean;
  className?: string;
}

export const TreeConnector = ({
  fromX,
  fromY,
  toX,
  toY,
  gender = "male",
  animated = true,
  className,
}: TreeConnectorProps) => {
  // Calculate path
  const midY = fromY + (toY - fromY) / 2;
  const path = `M${fromX},${fromY} L${fromX},${midY} L${toX},${midY} L${toX},${toY}`;

  const strokeColor =
    gender === "male" ? "stroke-blue-400" : "stroke-purple-400";

  return animated ? (
    <motion.path
      d={path}
      fill="none"
      strokeWidth={2}
      className={cn(strokeColor, "stroke-dasharray-2", className)}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    />
  ) : (
    <path
      d={path}
      fill="none"
      strokeWidth={2}
      className={cn(strokeColor, "stroke-dasharray-2", className)}
    />
  );
};

export const HorizontalConnector = ({
  fromX,
  toX,
  y,
  gender = "male",
  animated = true,
  className,
}: {
  fromX: number;
  toX: number;
  y: number;
  gender?: "male" | "female";
  animated?: boolean;
  className?: string;
}) => {
  const path = `M${fromX},${y} L${toX},${y}`;
  const strokeColor =
    gender === "male" ? "stroke-blue-400" : "stroke-purple-400";

  return animated ? (
    <motion.path
      d={path}
      fill="none"
      strokeWidth={2}
      className={cn(strokeColor, className)}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    />
  ) : (
    <path
      d={path}
      fill="none"
      strokeWidth={2}
      className={cn(strokeColor, className)}
    />
  );
};

export const VerticalConnector = ({
  x,
  fromY,
  toY,
  gender = "male",
  animated = true,
  className,
}: {
  x: number;
  fromY: number;
  toY: number;
  gender?: "male" | "female";
  animated?: boolean;
  className?: string;
}) => {
  const path = `M${x},${fromY} L${x},${toY}`;
  const strokeColor =
    gender === "male" ? "stroke-blue-400" : "stroke-purple-400";

  return animated ? (
    <motion.path
      d={path}
      fill="none"
      strokeWidth={2}
      className={cn(strokeColor, className)}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    />
  ) : (
    <path
      d={path}
      fill="none"
      strokeWidth={2}
      className={cn(strokeColor, className)}
    />
  );
};
