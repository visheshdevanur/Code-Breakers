// Haversine distance between two lat/lng points in km
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestCamps(camp, allCamps, maxDistance = 50) {
  return allCamps
    .filter((c) => c.id !== camp.id)
    .map((c) => ({
      ...c,
      distance: haversineDistance(camp.latitude, camp.longitude, c.latitude, c.longitude),
    }))
    .filter((c) => c.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

export function estimateDeliveryTime(distanceKm, roadAccessibility = 5) {
  const baseSpeed = 30; // km/h in disaster zone
  const adjustedSpeed = baseSpeed * (roadAccessibility / 10);
  return +(distanceKm / Math.max(adjustedSpeed, 5)).toFixed(1);
}
