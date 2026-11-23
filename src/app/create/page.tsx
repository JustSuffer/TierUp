"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Download, Save, Plus, Settings2, Trash2, RotateCcw, Sparkles, X } from "lucide-react";
import * as htmlToImage from "html-to-image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Types & Data ---
type Item = { id: string; content: string; image?: string };
type Tier = { id: string; label: string; color: string; items: Item[] };

const INITIAL_TIERS: Tier[] = [
  { id: "tier-s", label: "S", color: "#FF4757", items: [] },
  { id: "tier-a", label: "A", color: "#FFA502", items: [] },
  { id: "tier-b", label: "B", color: "#ECCC68", items: [] },
  { id: "tier-c", label: "C", color: "#2ED573", items: [] },
  { id: "tier-d", label: "D", color: "#1E90FF", items: [] },
];

const INITIAL_ITEMS: Item[] = [
  { id: "item-1", content: "React" },
  { id: "item-2", content: "Vue" },
  { id: "item-3", content: "Angular" },
  { id: "item-4", content: "Svelte" },
  { id: "item-5", content: "Next.js" },
  { id: "item-6", content: "Nuxt" },
  { id: "item-7", content: "Astro" },
  { id: "item-8", content: "Remix" },
];

// --- Sub-components ---
// Zero-animation SortableItem: places immediately without sliding or transform transition animations
function SortableItem({ 
  item, 
  onRemove,
  onQuickMove,
  tiers
}: { 
  item: Item; 
  onRemove?: () => void;
  onQuickMove?: (tierId: string) => void;
  tiers?: Tier[];
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: item.id,
    data: { type: "Item", item },
  });

  // NO animation: transition is explicitly undefined / none to snap immediately
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: undefined, // Zero animation!
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group select-none"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          if (onQuickMove && tiers) {
            setShowQuickMenu((prev) => !prev);
          }
        }}
        className="w-20 h-20 bg-brand-black border border-white/20 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:border-brand-purple-light shadow-md text-sm font-medium text-center p-1.5 break-words overflow-hidden text-white"
      >
        {item.content}
      </div>

      {/* Delete / Return button */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow transition-opacity hover:scale-110 z-10"
          title="Return to pool / Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Quick Tier Placement Popover for unassigned items */}
      {showQuickMenu && onQuickMove && tiers && (
        <div 
          className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-black/95 border border-white/25 p-1.5 rounded-xl shadow-2xl flex gap-1 z-50 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onQuickMove(t.id);
                setShowQuickMenu(false);
              }}
              style={{ backgroundColor: t.color }}
              className="w-7 h-7 rounded-lg font-black text-black text-xs flex items-center justify-center hover:brightness-110 active:scale-95 shadow"
              title={`Place in ${t.label}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main Page Component ---
export default function CreateTierUp() {
  const [tiers, setTiers] = useState<Tier[]>(INITIAL_TIERS);
  const [unassignedItems, setUnassignedItems] = useState<Item[]>(INITIAL_ITEMS);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  // New item inputs
  const [newItemText, setNewItemText] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  
  const tierListRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor)
  );

  // Add a single item immediately without animation
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    const newItem: Item = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      content: trimmed,
    };

    setUnassignedItems((prev) => [newItem, ...prev]);
    setNewItemText("");
  };

  // Add multiple items at once
  const handleBulkAdd = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newItems: Item[] = lines.map((content, idx) => ({
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      content,
    }));

    setUnassignedItems((prev) => [...newItems, ...prev]);
    setBulkText("");
    setIsBulkOpen(false);
  };

  // Quick move item into a tier directly with NO animation
  const handleQuickMoveToTier = (tierId: string, item: Item) => {
    setUnassignedItems((prev) => prev.filter((i) => i.id !== item.id));
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id === tierId) {
          return { ...t, items: [...t.items, item] };
        }
        return { ...t, items: t.items.filter((i) => i.id !== item.id) };
      })
    );
  };

  // Return item from a tier back to the pool immediately
  const handleReturnToPool = (tierId: string, itemId: string) => {
    let returnedItem: Item | undefined;
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id === tierId) {
          returnedItem = t.items.find((i) => i.id === itemId);
          return { ...t, items: t.items.filter((i) => i.id !== itemId) };
        }
        return t;
      })
    );
    if (returnedItem) {
      setUnassignedItems((prev) => [returnedItem!, ...prev]);
    }
  };

  // Reset all items to default
  const handleReset = () => {
    setTiers(INITIAL_TIERS);
    setUnassignedItems(INITIAL_ITEMS);
  };

  // Clear everything
  const handleClearAll = () => {
    setTiers(INITIAL_TIERS);
    setUnassignedItems([]);
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const itemData = active.data.current?.item;
    if (itemData) setActiveItem(itemData);
  };

  const handleDragEnd = (event: any) => {
    setActiveItem(null);
    const { active, over } = event;
    
    if (!over) return;
    if (active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    // Find source
    let sourceTierId = "unassigned";
    let activeItemObj: Item | undefined = unassignedItems.find((i) => i.id === activeId);
    if (!activeItemObj) {
      for (const t of tiers) {
        const found = t.items.find((i) => i.id === activeId);
        if (found) {
          activeItemObj = found;
          sourceTierId = t.id;
          break;
        }
      }
    }

    if (!activeItemObj) return;

    // Remove from source immediately
    if (sourceTierId === "unassigned") {
      setUnassignedItems((prev) => prev.filter((i) => i.id !== activeId));
    } else {
      setTiers((prev) =>
        prev.map((t) =>
          t.id === sourceTierId
            ? { ...t, items: t.items.filter((i) => i.id !== activeId) }
            : t
        )
      );
    }

    // Determine target location
    let targetTierId = "unassigned";
    if (overId === "unassigned" || unassignedItems.some((i) => i.id === overId)) {
      targetTierId = "unassigned";
    } else {
      for (const t of tiers) {
        if (t.id === overId || t.items.some((i) => i.id === overId)) {
          targetTierId = t.id;
          break;
        }
      }
    }

    // Place into target immediately (direct placement without delay)
    if (targetTierId === "unassigned") {
      setUnassignedItems((prev) => [activeItemObj!, ...prev]);
    } else {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id === targetTierId) {
            return { ...t, items: [...t.items, activeItemObj!] };
          }
          return t;
        })
      );
    }
  };

  const exportAsImage = useCallback(() => {
    if (tierListRef.current === null) return;
    htmlToImage
      .toPng(tierListRef.current, { cacheBust: true, backgroundColor: "#0B0B0F" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-tierup.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Error exporting image", err));
  }, [tierListRef]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-16">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-3 border-b border-white/10">
        <div>
          <input 
            type="text" 
            defaultValue="Web Frameworks Tier List" 
            className="text-2xl sm:text-3xl font-black bg-transparent border-none outline-none focus:ring-0 text-white placeholder:text-white/30"
          />
          <p className="text-white/50 text-xs sm:text-sm mt-0.5">
            Drag items or click an item to place directly into tiers. No animations, instant placement!
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} title="Reset to Defaults">
            <RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={exportAsImage}>
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export Image</span>
          </Button>
          <Button variant="primary" size="sm">
            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        {/* Tier rows container wrapper for image export */}
        <div 
          ref={tierListRef} 
          className="flex flex-col gap-1.5 p-2 bg-brand-black border border-white/10 rounded-2xl shadow-2xl"
        >
          {tiers.map((tier) => (
            <div key={tier.id} className="flex min-h-[92px] bg-white/5 rounded-xl overflow-hidden group">
              {/* Tier Label */}
              <div 
                className="w-20 sm:w-28 flex items-center justify-center relative overflow-hidden flex-shrink-0 select-none"
                style={{ 
                  backgroundColor: tier.color,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <span 
                  className="font-black text-2xl sm:text-3xl tracking-widest text-[#1a1a1a]"
                  style={{ textShadow: "0 1px 1px rgba(255,255,255,0.3)" }}
                >
                  {tier.label}
                </span>
              </div>
              
              {/* Tier Droppable Area */}
              <div className="flex-1 p-2 flex flex-wrap gap-2 items-center" id={tier.id}>
                <SortableContext id={tier.id} items={tier.items.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
                  {tier.items.map((item) => (
                    <SortableItem 
                      key={item.id} 
                      item={item} 
                      onRemove={() => handleReturnToPool(tier.id, item.id)}
                    />
                  ))}
                  {/* Empty state receiver to keep zone droppable */}
                  {!tier.items.length && (
                    <div className="w-full h-full min-h-[75px] flex items-center justify-center text-white/15 text-xs italic select-none">
                      Drag here or click item below to place in {tier.label}
                    </div>
                  )}
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        {/* Tray / Item Pool - Placed immediately beneath the tierlist */}
        <div className="mt-3 bg-black/60 border border-white/15 rounded-2xl p-4 shadow-xl space-y-3">
          {/* Header & Quick Add Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">Item Pool</span>
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-mono text-white/70">
                {unassignedItems.length} items
              </span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddItem} className="flex items-center gap-2 flex-1 sm:max-w-md">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Type item name & press Enter..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-purple-light"
              />
              <Button type="submit" size="sm" variant="primary" className="py-1.5 px-3">
                <Plus className="w-4 h-4" /> Add
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="glass" 
                className="py-1.5 px-3 text-xs"
                onClick={() => setIsBulkOpen((v) => !v)}
              >
                Bulk
              </Button>
              {unassignedItems.length > 0 && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="ghost" 
                  className="py-1.5 px-2 text-red-400 hover:text-red-300"
                  onClick={handleClearAll}
                  title="Clear all items"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </form>
          </div>

          {/* Bulk Paste Expander */}
          {isBulkOpen && (
            <div className="bg-white/5 border border-white/15 p-3 rounded-xl space-y-2">
              <label className="text-xs text-white/70 block">
                Paste multiple items (one per line or comma-separated):
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Item 1&#10;Item 2&#10;Item 3..."
                rows={3}
                className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-sm text-white outline-none focus:border-brand-purple-light resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsBulkOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleBulkAdd}>
                  Add All to Pool
                </Button>
              </div>
            </div>
          )}

          {/* Items Tray Area - directly placed starting from top-left */}
          <div className="min-h-[100px] p-2 bg-white/[0.02] border border-white/10 rounded-xl" id="unassigned">
            <SortableContext id="unassigned" items={unassignedItems.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap gap-2.5 items-start">
                {unassignedItems.map((item) => (
                  <SortableItem 
                    key={item.id} 
                    item={item} 
                    onQuickMove={(tierId) => handleQuickMoveToTier(tierId, item)}
                    tiers={tiers}
                    onRemove={() => setUnassignedItems((prev) => prev.filter((i) => i.id !== item.id))}
                  />
                ))}
                {!unassignedItems.length && (
                  <div className="w-full py-6 flex flex-col items-center justify-center text-white/40 text-sm border border-dashed border-white/10 rounded-lg">
                    <span>Item pool is empty.</span>
                    <span className="text-xs text-white/25 mt-0.5">Type above or paste bulk items to add them directly here!</span>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* Drag Overlay (Visual while dragging) */}
        <DragOverlay>
          {activeItem ? (
            <div className="w-20 h-20 bg-brand-black border-2 border-brand-purple-light rounded-xl flex items-center justify-center shadow-2xl text-sm font-semibold text-center p-1.5 text-white z-50">
              {activeItem.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
