'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult } from '@/lib/calculate';
import {
  Trophy,
  FileText,
  Calculator,
  ChevronRight,
  Sparkles,
  Hash,
  Sigma,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { useState } from 'react';

interface ResultViewProps {
  result: CalculationResult | null;
}

export default function ResultView({ result }: ResultViewProps) {
  // Add hover state for characters to highlight all occurrences of the same character across steps
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);

  if (!result) {
    return null;
  }

  const { charAnalysis, sequence, grandTotal, reductionSteps, finalReduced, original, normalized } = result;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 font-cairo">
      {/* ═══════════════════════════════════════════════════════════════
          HERO: Final Digital Root Result
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="glass overflow-hidden border-sky-500/20 shadow-[0_0_50px_rgba(56,189,248,0.15)] relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-transparent blur-2xl pointer-events-none" />
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              النتيجة الرقمية الختامية
            </span>
          </div>
          <CardTitle className="text-3xl font-black text-white">الرقم النهائي المبوّب (Digital Root)</CardTitle>
        </CardHeader>
        <CardContent className="pb-10 pt-4 flex flex-col items-center">
          <div className="relative flex justify-center items-center px-4 mb-4">
            <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
            <span className="text-[11rem] font-black leading-none bg-gradient-to-b from-white via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] animate-in zoom-in duration-1000 select-none">
              {finalReduced}
            </span>
          </div>
          
          {/* Path to reduction */}
          <div className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/5 px-6 py-2.5 rounded-full shadow-inner">
            <span className="text-xs font-bold text-slate-500">مسار الاختزال:</span>
            <div className="flex items-center gap-2 font-mono font-bold text-sky-400">
              {reductionSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={idx === reductionSteps.length - 1 ? "text-yellow-400 text-lg font-black" : ""}>
                    {step}
                  </span>
                  {idx < reductionSteps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 rtl:rotate-180" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 1: Character Indexing
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20">
              ١
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              الخطوة الأولى: الترتيب التصاعدي (Character Indexing)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">N = {sequence.length} حرفاً</span>
        </div>

        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              يتم تفكيك النص المستهدف بعد تنقيته من المسافات وعلامات الترقيم وتوحيد الهمزات، ثم إعطاء كل حرف ترتيباً تصاعدياً من <span className="text-emerald-400 font-bold">1</span> إلى <span className="text-emerald-400 font-bold">{sequence.length}</span>:
            </p>
            {/* Letter Grid */}
            <div className="flex flex-wrap justify-center gap-3 pt-2" dir="rtl">
              {sequence.map((step, i) => {
                const isHovered = hoveredChar === step.char;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredChar(step.char)}
                    onMouseLeave={() => setHoveredChar(null)}
                    className={`flex flex-col items-center gap-2 group cursor-pointer p-2 rounded-xl transition-all duration-300 ${
                      isHovered ? 'bg-white/10 scale-105 border border-sky-500/30' : 'bg-white/[0.01] border border-transparent'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                      isHovered 
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10' 
                        : 'bg-white/5 border-white/10 text-white group-hover:bg-white/10 group-hover:text-sky-300'
                    }`}>
                      {step.char}
                    </div>
                    <span className={`text-xs font-black transition-colors ${
                      isHovered ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400'
                    }`}>
                      ({step.originalIndex})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 2 & 3: Multiply by 8 and Square
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/20">
            ٢
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            الخطوة الثانية والثالثة: الضرب في 8 ثم التربيع
          </h3>
        </div>

        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              يتم ضرب الترتيب الأصلي للحرف في 8 للحصول على قيمة الخطوة الثانية، ثم يتم تربيع هذه القيمة للحصول على قيمة الخطوة الثالثة:
            </p>
            {/* Squared Index List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-2" dir="rtl">
              {sequence.map((step, i) => {
                const isHovered = hoveredChar === step.char;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredChar(step.char)}
                    onMouseLeave={() => setHoveredChar(null)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                      isHovered 
                        ? 'bg-violet-500/10 border-violet-500/40 scale-105 shadow-md shadow-violet-500/5'
                        : 'bg-white/[0.02] border-white/5 hover:border-violet-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[0.6rem] font-bold text-slate-500">ترتيب {step.originalIndex}</span>
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                        isHovered ? 'bg-violet-500/30 text-violet-300' : 'bg-white/5 text-slate-300'
                      }`}>{step.char}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-400 flex flex-col items-center">
                      <span>{step.originalIndex} × 8 = {step.step2Value}</span>
                    </div>
                    <div className="font-mono text-base font-black text-violet-400">
                      {step.step2Value}² = <span className="text-xl text-white">{step.indexSquared}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 3: Character Value Summation (Grouping)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-amber-500/20">
            ٣
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            الخطوة الرابعة: تجميع قيم الحروف المتشابهة (Grouping & Summation)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
          {charAnalysis.map((analysis, idx) => {
            const isHovered = hoveredChar === analysis.char;
            return (
              <Card
                key={idx}
                onMouseEnter={() => setHoveredChar(analysis.char)}
                onMouseLeave={() => setHoveredChar(null)}
                className={`glass border-white/5 transition-all duration-500 group relative overflow-hidden cursor-pointer ${
                  isHovered ? 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-500/[0.03]' : 'hover:border-amber-500/20'
                }`}
              >
                <div className="absolute top-2 left-3">
                  <div className="text-[0.6rem] font-bold text-slate-600 group-hover:text-amber-500/50 transition-colors uppercase">
                    الحرف {idx + 1}
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  {/* Char & Summed Value */}
                  <div className="flex items-end justify-between">
                    <span className={`text-5xl font-black transition-all duration-500 ${
                      isHovered ? 'text-amber-300 scale-110' : 'text-white'
                    }`}>
                      {analysis.char}
                    </span>
                    <div className="text-left">
                      <span className="block text-2xl font-black text-amber-400 font-mono">
                        {analysis.groupedValue}
                      </span>
                      <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wider block">
                        القيمة المتجمعة
                      </span>
                    </div>
                  </div>

                  {/* Squared sums detailed explanation */}
                  <div className="space-y-2.5 pt-3 border-t border-white/5">
                    <div className="flex justify-between text-[0.7rem] font-bold">
                      <span className="text-slate-500">المواقع الأصلية (الخطوة ١):</span>
                      <span className="text-teal-400 font-mono">
                        [{analysis.positions.join(', ')}]
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-[0.7rem] font-bold mt-1">
                      <span className="text-slate-500">الضرب في 8 (الخطوة ٢):</span>
                      <span className="text-violet-400 font-mono">
                        [{analysis.step2Values.join(', ')}]
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-[0.7rem] font-bold mt-1">
                      <span className="text-slate-500">تجميع المربعات (الخطوة ٣):</span>
                      <div className="bg-black/20 p-2 rounded-lg font-mono text-sky-400 text-xs mt-1 text-left break-all select-all">
                        {analysis.squares.join(' + ')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 4: Cross-Multiplication, Total Sum & Final Reduction
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
            ٤
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            الخطوة الخامسة: الضرب التبادلي، الجمع الكلي، والتبسيط النهائي
          </h3>
        </div>

        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6 space-y-8">
            
            {/* Explanatory subtitle */}
            <p className="text-slate-400 text-sm leading-relaxed">
              يتم ضرب (القيمة الناتجة في الخطوة الثانية) في (القيمة المتجمعة للحرف من الخطوة الرابعة)، ثم نجمع كل نواتج الضرب معاً للحصول على المجموع الكلي، وأخيراً نبسط المجموع الكلي إلى رقم واحد (من 1 إلى 9).
            </p>

            {/* Cross-Multiplication Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  معادلات الضرب التبادلي للمواضع
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" dir="rtl">
                {sequence.map((step, i) => {
                  const isHovered = hoveredChar === step.char;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredChar(step.char)}
                      onMouseLeave={() => setHoveredChar(null)}
                      className={`p-3 rounded-xl border flex justify-between items-center transition-all duration-300 cursor-pointer ${
                        isHovered 
                          ? 'bg-blue-500/10 border-blue-500/30 scale-[1.02]' 
                          : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isHovered ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-slate-300'
                        }`}>
                          {step.char}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.6rem] text-slate-500 font-bold">الموقع {step.originalIndex}</span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {step.step2Value} × {step.groupedValue}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-sm font-black text-blue-400">
                        {step.multiplicationResult}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grand Total Equation Block */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Sigma className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  معادلة الجمع الكلي (Grand Total Summation)
                </span>
              </div>
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-center space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm font-mono text-slate-400 select-all" dir="ltr">
                  {sequence.map((step, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span 
                        onMouseEnter={() => setHoveredChar(step.char)}
                        onMouseLeave={() => setHoveredChar(null)}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          hoveredChar === step.char ? 'bg-blue-500/20 text-blue-300 font-bold' : ''
                        }`}
                      >
                        {step.multiplicationResult}
                      </span>
                      {i < sequence.length - 1 && <span className="text-slate-600 font-bold">+</span>}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center gap-1 pt-2 border-t border-white/5">
                  <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">المجموع الكلي الكلي</span>
                  <span className="text-4xl font-black text-white bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-8 py-2 rounded-xl border border-blue-500/20 font-mono shadow-md select-all">
                    {grandTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Final Digital Reduction Block */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  التبسيط النهائي للمجموع الكلي (Digital Root Reduction)
                </span>
              </div>
              <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {reductionSteps.map((step, idx) => {
                    const isLast = idx === reductionSteps.length - 1;
                    
                    // Generate explanation of summing digits: e.g. "1 + 1 + 1 + 0 = 3"
                    let digitSumText = "";
                    if (idx < reductionSteps.length - 1) {
                      digitSumText = step.split('').join(' + ') + ' = ' + reductionSteps[idx + 1];
                    }

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex flex-col items-center bg-black/10 px-4 py-2.5 rounded-xl border border-white/[0.02]">
                          <span className={`font-mono font-black ${
                            isLast ? "text-yellow-400 text-3xl" : "text-slate-300 text-lg"
                          }`}>
                            {step}
                          </span>
                          {!isLast && (
                            <span className="text-[0.65rem] font-bold text-slate-500 font-mono mt-1">
                              ({step.split('').join('+')})
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[0.65rem] font-black text-yellow-500/70 mt-1">
                              الرقم النهائي
                            </span>
                          )}
                        </div>
                        {!isLast && (
                          <ChevronRight className="w-4 h-4 text-slate-600 rtl:rotate-180" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[0.7rem] text-slate-500 leading-relaxed italic max-w-md">
                  يتم جمع خانات الرقم الكلي بشكل متكرر حتى نصل إلى رقم مفرد بين 1 و 9.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Summary Details
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
        {/* Normalized Text Detail */}
        <Card className="glass border-white/5 glass-hover transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              النص المعالج الموحد
            </CardTitle>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-black/20 rounded-2xl border border-white/5">
              <p
                className="text-3xl font-black text-center text-emerald-300 tracking-[0.25em] break-all leading-normal select-all font-mono"
                dir="rtl"
              >
                {normalized.split('').join(' ')}
              </p>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>النص الأصلي:</span>
                <span className="font-bold text-slate-300 max-w-[200px] truncate select-all">{original}</span>
              </div>
              <div className="flex justify-between">
                <span>طول النص المعالج:</span>
                <span className="font-bold text-emerald-400 font-mono">{normalized.length} حرفاً</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Metas */}
        <Card className="glass border-white/5 glass-hover transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              توزيع الحسابات الرقمية
            </CardTitle>
            <div className="w-2 h-2 rounded-full bg-violet-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: 'عدد الحروف الفريدة',
                value: `${charAnalysis.length} حرفاً فريداً`,
                color: 'text-sky-400',
              },
              {
                label: 'المجموع الكلي قبل الاختزال',
                value: grandTotal,
                color: 'text-blue-400 font-mono font-bold',
              },
              {
                label: 'مراحل التبسيط والجمع',
                value: `${reductionSteps.length - 1} خطوة`,
                color: 'text-violet-400',
              },
              {
                label: 'الرقم النهائي المبوّب',
                value: finalReduced,
                color: 'text-yellow-400 font-black text-lg font-mono',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <span className="text-xs font-bold text-slate-500">
                  {item.label}
                </span>
                <span className={`${item.color} break-all text-right`}>
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
