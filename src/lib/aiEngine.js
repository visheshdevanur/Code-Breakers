import { haversineDistance, findNearestCamps, estimateDeliveryTime } from './geoUtils';
import { getCampResources, getDaysRemaining } from './seedData';

// WHO/Sphere Standards: per person per day
const STANDARDS = {
  food: { base: 2, unit: 'kits', childMult: 1, elderlyMult: 1, injuredMult: 1, pregnantMult: 1 },
  water: { base: 3, unit: 'liters', childMult: 1, elderlyMult: 1, injuredMult: 1.5, pregnantMult: 1.3 },
  medicine: { base: 0.5, unit: 'packs', childMult: 1, elderlyMult: 2, injuredMult: 3, pregnantMult: 1.3 },
  shelter: { base: 1, unit: 'beds', childMult: 1, elderlyMult: 1, injuredMult: 1, pregnantMult: 1 },
};

const SAFE_DAYS = 3;

// Calculate daily needs for a camp based on population demographics
export function calculateDailyNeeds(camp) {
  const normal = camp.current_population - (camp.children_count || 0) - (camp.elderly_count || 0) - (camp.injured_count || 0) - (camp.pregnant_count || 0);
  const needs = {};
  for (const [type, std] of Object.entries(STANDARDS)) {
    needs[type] = Math.ceil(
      (Math.max(normal, 0) * std.base) +
      ((camp.children_count || 0) * std.base * std.childMult) +
      ((camp.elderly_count || 0) * std.base * std.elderlyMult) +
      ((camp.injured_count || 0) * std.base * std.injuredMult) +
      ((camp.pregnant_count || 0) * std.base * std.pregnantMult)
    );
  }
  return needs;
}

// Calculate priority score for a camp
export function calculatePriorityScore(camp, resources) {
  const campRes = resources.filter(r => r.camp_id === camp.id);
  let minHours = Infinity;
  campRes.forEach(r => {
    if (r.daily_consumption > 0) {
      const hours = (r.quantity / r.daily_consumption) * 24;
      if (hours < minHours) minHours = hours;
    }
  });
  if (minHours === Infinity) minHours = 72;

  const urgency = Math.min(10, Math.max(0, 10 - (minHours / 7.2)));
  const population = Math.min(10, (camp.current_population / Math.max(camp.total_capacity, 1)) * 10);
  const accessibility = 10 - Math.min(10, camp.road_accessibility || 5);

  return +((urgency * 3) + (population * 2) + (accessibility * 1)).toFixed(1);
}

// Get status based on priority score
export function getStatus(score) {
  if (score > 18) return { status: 'critical', color: '#dc2626', bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', label: '🔴 CRITICAL' };
  if (score > 12) return { status: 'warning', color: '#f59e0b', bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', label: '🟠 WARNING' };
  if (score > 6) return { status: 'watch', color: '#eab308', bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', label: '🟡 WATCH' };
  return { status: 'stable', color: '#16a34a', bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', label: '🟢 STABLE' };
}

// Generate redistribution recommendations
export function generateRecommendations(camps, allResources) {
  const recommendations = [];
  const resourceTypes = ['food', 'water', 'medicine', 'shelter'];

  const campScores = camps.map(c => ({
    ...c,
    score: calculatePriorityScore(c, allResources),
    resources: allResources.filter(r => r.camp_id === c.id),
  }));

  const criticalCamps = campScores.filter(c => c.score > 18).sort((a, b) => b.score - a.score);
  const surplusCamps = campScores.filter(c => c.score <= 6);

  criticalCamps.forEach(critical => {
    resourceTypes.forEach(type => {
      const cRes = critical.resources.find(r => r.resource_type === type);
      if (!cRes || getDaysRemaining(cRes) > 1) return;

      const needs = calculateDailyNeeds(critical);
      const deficit = (needs[type] * SAFE_DAYS) - (cRes?.quantity || 0);
      if (deficit <= 0) return;

      const nearest = findNearestCamps(critical, surplusCamps, 60);
      for (const source of nearest) {
        const sRes = source.resources?.find(r => r.resource_type === type);
        if (!sRes) continue;
        const srcDays = getDaysRemaining(sRes);
        if (srcDays <= 2) continue;

        const srcNeeds = calculateDailyNeeds(source);
        const transferable = sRes.quantity - (srcNeeds[type] * 2);
        if (transferable <= 0) continue;

        const qty = Math.min(deficit, transferable);
        const eta = estimateDeliveryTime(source.distance, critical.road_accessibility);

        recommendations.push({
          id: `rec-${critical.id}-${source.id}-${type}`,
          source_camp_id: source.id,
          source_camp: source.village,
          target_camp_id: critical.id,
          target_camp: critical.village,
          resource_type: type,
          quantity: Math.round(qty),
          priority_score: critical.score,
          estimated_delivery_hours: eta,
          distance: +source.distance.toFixed(1),
          reason: `${critical.village} has ${getDaysRemaining(cRes)} days of ${type}. ${source.village} has ${srcDays.toFixed(1)} days surplus.`,
          status: 'pending',
        });
        break;
      }
    });
  });

  return recommendations.sort((a, b) => b.priority_score - a.priority_score);
}

// Detect duplication: surplus camps with incoming transfers
export function detectDuplications(camps, allResources, transfers = []) {
  const warnings = [];
  camps.forEach(camp => {
    const res = allResources.filter(r => r.camp_id === camp.id);
    res.forEach(r => {
      const days = getDaysRemaining(r);
      if (days > 5) {
        const incoming = transfers.filter(t => t.to_camp_id === camp.id && t.resource_type === r.resource_type && t.status !== 'delivered');
        if (incoming.length > 0) {
          warnings.push({ camp, resource: r, days, incoming });
        }
      }
    });
  });
  return warnings;
}

// Detect forgotten zones: camps with zero stock or no recent report
export function detectForgottenZones(camps, allResources) {
  const forgotten = [];
  camps.forEach(camp => {
    const res = allResources.filter(r => r.camp_id === camp.id);
    const hasZero = res.some(r => r.quantity <= 0);
    const hasVeryLow = res.some(r => getDaysRemaining(r) < 0.25);
    const lastReport = camp.last_report_at ? new Date(camp.last_report_at) : null;
    const hoursSinceReport = lastReport ? (Date.now() - lastReport.getTime()) / (1000 * 60 * 60) : 999;
    const isSilent = hoursSinceReport > 12;

    if (hasZero || hasVeryLow || isSilent) {
      forgotten.push({
        ...camp,
        reasons: [
          ...(hasZero ? ['Zero stock on one or more resources'] : []),
          ...(hasVeryLow ? ['Less than 6 hours remaining'] : []),
          ...(isSilent ? [`No report in ${Math.round(hoursSinceReport)}h`] : []),
        ],
        resources: res,
      });
    }
  });
  return forgotten;
}

// Calculate deficit for each resource at a camp
export function calculateDeficit(camp, resources) {
  const needs = calculateDailyNeeds(camp);
  const campRes = resources.filter(r => r.camp_id === camp.id);

  return Object.entries(needs).map(([type, dailyNeed]) => {
    const res = campRes.find(r => r.resource_type === type);
    const currentStock = res?.quantity || 0;
    const safeStock = dailyNeed * SAFE_DAYS;
    const deficit = Math.max(0, safeStock - currentStock);
    const hoursRemaining = dailyNeed > 0 ? +((currentStock / dailyNeed) * 24).toFixed(1) : 999;
    const score = calculatePriorityScore(camp, resources);

    return {
      resource_type: type,
      unit: STANDARDS[type].unit,
      daily_need: dailyNeed,
      safe_stock: safeStock,
      current_stock: currentStock,
      deficit,
      hours_remaining: hoursRemaining,
      days_remaining: +(hoursRemaining / 24).toFixed(1),
      status: getStatus(hoursRemaining < 6 ? 25 : hoursRemaining < 24 ? 15 : hoursRemaining < 48 ? 8 : 3),
    };
  });
}

export const CONVERSION_RATES = { food: 20, water: 5, medicine: 100, shelter: 500 };

export function allocateDonation(amount, preferredResource, camps, resources) {
  const scores = camps.map(c => ({ ...c, score: calculatePriorityScore(c, resources) })).sort((a, b) => b.score - a.score);
  const targetCamp = scores[0];
  const resType = preferredResource === 'any' ? 'food' : preferredResource;
  const qty = Math.floor(amount / CONVERSION_RATES[resType]);
  return { camp: targetCamp, resource_type: resType, quantity: qty };
}
