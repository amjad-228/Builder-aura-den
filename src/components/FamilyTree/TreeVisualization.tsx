import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FamilyTreeNode } from "@/types/family";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { HorizontalConnector, VerticalConnector } from "./TreeConnector";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeVisualizationProps {
  treeData: FamilyTreeNode | null;
  onSelectMember?: (id: string) => void;
  className?: string;
}

export const TreeVisualization = ({
  treeData,
  onSelectMember,
  className,
}: TreeVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8); // Start with smaller scale on mobile
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  // Detect if we're on a mobile device
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  // Node spacing constants - smaller for mobile
  const HORIZONTAL_SPACING = isMobile ? 150 : 200;
  const VERTICAL_SPACING = isMobile ? 120 : 150;
  const NODE_WIDTH = isMobile ? 90 : 120;
  const NODE_HEIGHT = isMobile ? 120 : 150;

  // Calculate positions of nodes in the tree
  useEffect(() => {
    if (!treeData) return;

    const positions = new Map<string, { x: number; y: number }>();

    // Recursive function to layout nodes
    const layoutNodes = (
      node: FamilyTreeNode,
      level: number,
      index: number,
      totalSiblings: number,
    ) => {
      // Calculate x position based on index within siblings
      const baseX = (index - totalSiblings / 2) * HORIZONTAL_SPACING;

      // Adjust for parent's position if not root
      const x = level === 0 ? 0 : baseX;
      const y = level * VERTICAL_SPACING;

      positions.set(node.member.id, { x, y });

      // Position children
      const childCount = node.children.length;
      node.children.forEach((child, childIndex) => {
        layoutNodes(child, level + 1, childIndex, childCount);
      });
    };

    // Start layout from root
    layoutNodes(treeData, 0, 0, 1);
    setNodePositions(positions);

    // Center view initially
    if (containerRef.current) {
      setPosition({
        x: containerRef.current.clientWidth / 2,
        y: 80, // Start closer to top on mobile
      });
    }
  }, [treeData, HORIZONTAL_SPACING, VERTICAL_SPACING]);

  // Handle touch/mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);

    // Get coordinates based on event type
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setStartPoint({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    // Prevent default to stop scrolling on touch devices
    e.preventDefault();

    // Get coordinates based on event type
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setPosition({
      x: clientX - startPoint.x,
      y: clientY - startPoint.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    if (containerRef.current) {
      setScale(isMobile ? 0.8 : 1);
      setPosition({
        x: containerRef.current.clientWidth / 2,
        y: isMobile ? 80 : 100,
      });
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.4));
  };

  // Recursive function to render nodes
  const renderNode = (node: FamilyTreeNode) => {
    const pos = nodePositions.get(node.member.id);
    if (!pos) return null;

    return (
      <motion.div
        key={node.member.id}
        className="absolute touch-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          left: pos.x - NODE_WIDTH / 2 + position.x,
          top: pos.y + position.y,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        }}
        onClick={() => onSelectMember?.(node.member.id)}
      >
        <FamilyMemberCard member={node.member} compact />
      </motion.div>
    );
  };

  // Render connections between nodes
  const renderConnections = () => {
    if (!treeData) return null;

    const connections: JSX.Element[] = [];
    // We'll use a counter to ensure unique keys
    let connectionCounter = 0;

    // Function to draw connections
    const drawConnections = (node: FamilyTreeNode) => {
      const nodePos = nodePositions.get(node.member.id);
      if (!nodePos) return;

      // Connect parent to children
      node.children.forEach((child) => {
        const childPos = nodePositions.get(child.member.id);
        if (childPos) {
          // Calculate absolute positions
          const fromX = nodePos.x + position.x;
          const fromY = nodePos.y + NODE_HEIGHT / 2 + position.y;
          const toX = childPos.x + position.x;
          const toY = childPos.y + position.y;

          // Create a unique ID for this parent-child connection
          const connectionId = `connection-${connectionCounter++}`;

          // Add vertical line from parent
          connections.push(
            <VerticalConnector
              key={`vert-from-${connectionId}`}
              x={fromX}
              fromY={fromY}
              toY={fromY + 30}
              gender={node.member.gender}
            />,
          );

          // Add horizontal connector between siblings if more than one child
          if (node.children.length > 1) {
            const firstChild = nodePositions.get(node.children[0].member.id);
            const lastChild = nodePositions.get(
              node.children[node.children.length - 1].member.id,
            );

            if (firstChild && lastChild) {
              const horizontalY = fromY + 30;
              connections.push(
                <HorizontalConnector
                  key={`horiz-${connectionId}`}
                  fromX={firstChild.x + position.x}
                  toX={lastChild.x + position.x}
                  y={horizontalY}
                  gender={node.member.gender}
                />,
              );
            }
          }

          // Add vertical line to child
          connections.push(
            <VerticalConnector
              key={`vert-to-${connectionId}`}
              x={childPos.x + position.x}
              fromY={fromY + 30}
              toY={toY}
              gender={child.member.gender}
            />,
          );
        }

        // Process child's connections recursively
        drawConnections(child);
      });
    };

    drawConnections(treeData);
    return connections;
  };

  if (!treeData) {
    return (
      <div className="p-6 text-center text-gray-500">
        لا توجد بيانات متاحة للشجرة العائلية
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden bg-gradient-to-br from-blue-50/30 to-purple-50/30",
        className,
      )}
    >
      {/* Zoom controls - bigger and more finger-friendly for mobile */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-row gap-2 md:top-4 md:flex-col">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm md:h-10 md:w-10 md:rounded-md"
        >
          <ZoomIn className="h-6 w-6 md:h-4 md:w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm md:h-10 md:w-10 md:rounded-md"
        >
          <ZoomOut className="h-6 w-6 md:h-4 md:w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm md:h-10 md:w-10 md:rounded-md"
        >
          <Home className="h-6 w-6 md:h-4 md:w-4" />
        </Button>
      </div>

      {/* Info message for mobile users */}
      <div className="absolute left-0 top-0 z-10 w-full bg-indigo-50 p-2 text-center text-xs text-indigo-800 md:hidden">
        اسحب لتحريك الشجرة واضغط على الأزرار للتكبير/التصغير
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1" fill="#6366f1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Tree container with touch events */}
      <div
        ref={containerRef}
        className={cn(
          "h-full w-full touch-pan-y",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove as React.MouseEventHandler}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove as React.TouchEventHandler}
        onTouchEnd={handleMouseUp}
      >
        <div
          className="relative h-full w-full transform"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <svg className="absolute inset-0 h-full w-full">
            {renderConnections()}
          </svg>

          {Array.from(nodePositions.entries()).map(([id, _]) => {
            const node = findNodeById(treeData, id);
            if (node) return renderNode(node);
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function to find a node by ID
function findNodeById(node: FamilyTreeNode, id: string): FamilyTreeNode | null {
  if (node.member.id === id) return node;

  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }

  return null;
}
