import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MetricGauge from './GenUI/MetricGauge';
import RiskMatrix from './GenUI/RiskMatrix';
import CompetitorMap from './GenUI/CompetitorMap';
import GanttComplianceChart from './GenUI/GanttComplianceChart';

const componentRegistry: Record<string, React.FC<{ data: any }>> = {
  MetricGauge,
  RiskMatrix,
  CompetitorMap,
  GanttComplianceChart
};

interface AIComponentRendererProps {
  uiInstruction: { component: string; data: any } | null;
}

export default function AIComponentRenderer({ uiInstruction }: AIComponentRendererProps) {
  if (!uiInstruction || typeof uiInstruction !== 'object') return null;

  const componentName = uiInstruction.component;
  if (!componentName) return null;

  const ComponentToRender = componentRegistry[componentName];

  if (!ComponentToRender) {
    return (
      <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400 text-sm my-6 flex items-center justify-center">
        GenUI Engine: Unknown UI artifact requested ({componentName})
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        key={componentName}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="my-10"
      >
        <Suspense fallback={
          <div className="w-full h-48 bg-zinc-900 animate-pulse rounded-2xl flex items-center justify-center border border-white/5">
            <span className="text-zinc-600 text-sm font-medium tracking-widest uppercase animate-pulse">Rendering Artifact...</span>
          </div>
        }>
          <ComponentToRender data={uiInstruction.data} />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
