export const generationRanges = {
  genZ: { min: 1997, max: 2012, label: 'Gen Z', color: '#06b6d4' },
  millennials: { min: 1981, max: 1996, label: 'Millennials', color: '#3b82f6' },
  genX: { min: 1965, max: 1980, label: 'Gen X', color: '#6366f1' },
  boomers: { min: 1946, max: 1964, label: 'Boomers', color: '#f59e0b' }
};

export const calculateActualGeneration = (birthYear) => {
  const year = parseInt(birthYear);
  
  if (year >= generationRanges.genZ.min && year <= generationRanges.genZ.max) {
    return 'genZ';
  }
  if (year >= generationRanges.millennials.min && year <= generationRanges.millennials.max) {
    return 'millennials';
  }
  if (year >= generationRanges.genX.min && year <= generationRanges.genX.max) {
    return 'genX';
  }
  if (year >= generationRanges.boomers.min && year <= generationRanges.boomers.max) {
    return 'boomers';
  }
  
  // For years outside defined ranges
  if (year > generationRanges.genZ.max) {
    return 'genZ'; // Future generations default to Gen Z
  }
  return 'boomers'; // Older generations default to Boomers
};

export const getGenerationColor = (generation) => {
  return generationRanges[generation]?.color || '#64748b';
};

export const getGenerationLabel = (generation) => {
  return generationRanges[generation]?.label || generation;
};

export const getGenerationColorClass = (generation) => {
  const colorMap = {
    genZ: 'bg-cyan-500',
    millennials: 'bg-blue-500',
    genX: 'bg-indigo-500',
    boomers: 'bg-amber-500'
  };
  return colorMap[generation] || 'bg-slate-500';
};

export const getGenerationTextClass = (generation) => {
  const colorMap = {
    genZ: 'text-cyan-600',
    millennials: 'text-blue-600',
    genX: 'text-indigo-600',
    boomers: 'text-amber-600'
  };
  return colorMap[generation] || 'text-slate-600';
};

export const getGenerationBgClass = (generation) => {
  const colorMap = {
    genZ: 'bg-cyan-50',
    millennials: 'bg-blue-50',
    genX: 'bg-indigo-50',
    boomers: 'bg-amber-50'
  };
  return colorMap[generation] || 'bg-slate-50';
};

export const calculateScores = (answers) => {
  const scores = {
    genZ: 0,
    millennials: 0,
    genX: 0,
    boomers: 0
  };

  answers.forEach((answer, index) => {
    if (answer) {
      const weight = index === 0 ? 3 : 2; // Q1 has weight 3, rest have weight 2
      scores[answer] += weight;
    }
  });

  return scores;
};

export const getWinningGeneration = (scores) => {
  let maxScore = 0;
  let winner = 'genZ';

  Object.entries(scores).forEach(([generation, score]) => {
    if (score > maxScore) {
      maxScore = score;
      winner = generation;
    }
  });

  return winner;
};