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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  // Node spacing constants
  const HORIZONTAL_SPACING = 200;
  const VERTICAL_SPACING = 150;
  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 150;

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
        y: 100,
      });
    }
  }, [treeData]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPoint({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPoint.x,
        y: e.clientY - startPoint.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    if (containerRef.current) {
      setScale(1);
      setPosition({
        x: containerRef.current.clientWidth / 2,
        y: 100,
      });
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Recursive function to render nodes
  const renderNode = (node: FamilyTreeNode) => {
    const pos = nodePositions.get(node.member.id);
    if (!pos) return null;

    return (
      <motion.div
        key={node.member.id}
        className="absolute"
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

          // Add vertical line from parent
          connections.push(
            <VerticalConnector
              key={`vert-${node.member.id}-${child.member.id}`}
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
                  key={`horiz-${node.member.id}-${firstChild.x}-${lastChild.x}`}
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
              key={`vert-to-${child.member.id}`}
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
      <div className="p-8 text-center text-gray-500">
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
      {/* Zoom controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white/80 backdrop-blur-sm"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white/80 backdrop-blur-sm"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          className="bg-white/80 backdrop-blur-sm"
        >
          <Home className="h-4 w-4" />
        </Button>
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

      {/* Tree container */}
      <div
        ref={containerRef}
        className={cn(
          "h-full w-full cursor-move",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
