export const CONTRACT_ADDRESSES = {
  CREDIT_PASSPORT: '0x1234567890123456789012345678901234567890', // Replace with actual deployed address
  SYNAPSE_TOKEN: '0x0987654321098765432109876543210987654321', // Replace with actual deployed address
} as const;

export const getScoreTier = (score: number): {
  tier: string;
  color: string;
  risk: 'Low' | 'Medium' | 'High';
} => {
  if (score >= 800) {
    return { tier: 'Excellent', color: '#10B981', risk: 'Low' };
  } else if (score >= 700) {
    return { tier: 'Good', color: '#3B82F6', risk: 'Low' };
  } else if (score >= 600) {
    return { tier: 'Fair', color: '#F59E0B', risk: 'Medium' };
  } else if (score >= 500) {
    return { tier: 'Poor', color: '#EF4444', risk: 'High' };
  } else {
    return { tier: 'Very Poor', color: '#DC2626', risk: 'High' };
  }
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};