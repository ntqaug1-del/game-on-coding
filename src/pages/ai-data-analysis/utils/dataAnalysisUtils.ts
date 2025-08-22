import { mean, median, standardDeviation, min, max, quantile } from 'simple-statistics';

/**
 * Analyzes a dataset and returns summary statistics
 */
export const analyzeData = (data: any[]) => {
  if (!data || data.length === 0) {
    return {
      summary: {
        rowCount: 0,
        columnCount: 0,
        missingValues: 0,
        outliers: 0,
      },
      correlations: [],
      distributions: [],
      fieldStats: [],
      insights: [],
    };
  }

  // Get column names
  const columns = Object.keys(data[0]);

  // Calculate summary statistics
  const summary = {
    rowCount: data.length,
    columnCount: columns.length,
    missingValues: countMissingValues(data),
    outliers: detectOutliers(data).length,
  };

  // Calculate field statistics
  const fieldStats = calculateFieldStats(data);

  // Calculate correlations between numeric fields
  const correlations = calculateCorrelations(data);

  // Calculate distributions for each field
  const distributions = calculateDistributions(data);

  return {
    summary,
    correlations,
    distributions,
    fieldStats,
  };
};

/**
 * Counts missing values in the dataset
 */
const countMissingValues = (data: any[]) => {
  let missingCount = 0;

  data.forEach(row => {
    Object.values(row).forEach(value => {
      if (value === null || value === undefined || value === '') {
        missingCount++;
      }
    });
  });

  return missingCount;
};

/**
 * Detects outliers in numeric fields using IQR method
 */
const detectOutliers = (data: any[]) => {
  const outliers: any[] = [];
  const numericFields = getNumericFields(data);

  numericFields.forEach(field => {
    const values = data.map(row => parseFloat(row[field])).filter(val => !isNaN(val));

    if (values.length > 0) {
      const q1 = quantile(values, 0.25);
      const q3 = quantile(values, 0.75);
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      data.forEach((row, index) => {
        const value = parseFloat(row[field]);
        if (!isNaN(value) && (value < lowerBound || value > upperBound)) {
          outliers.push({ rowIndex: index, field, value });
        }
      });
    }
  });

  return outliers;
};

/**
 * Detects anomalies in a specific field using Z-Score method
 */
export const detectAnomalies = (data: any[], field: string, sensitivityLevel: number = 2) => {
  if (!data || data.length === 0 || !field) {
    return [];
  }

  // Extract values for the selected field
  const values = data.map(row => parseFloat(row[field])).filter(val => !isNaN(val));

  if (values.length === 0) {
    return [];
  }

  // Calculate mean and standard deviation
  const meanValue = mean(values);
  const stdDev = standardDeviation(values);

  // If standard deviation is 0 or very small, no anomalies can be detected
  if (stdDev < 0.0001) {
    return [];
  }

  // Calculate Z-Score for each data point and detect anomalies
  const anomalyData = data.map((row, index) => {
    const value = parseFloat(row[field]);
    if (isNaN(value)) return null;

    const zScore = (value - meanValue) / stdDev;
    const isAnomaly = Math.abs(zScore) >= sensitivityLevel;

    return {
      id: index,
      time: `T${index + 1}`,
      value,
      isAnomaly,
      zScore
    };
  }).filter(Boolean);

  return anomalyData;
};

/**
 * Generates Z-Score distribution for anomaly detection visualization
 */
export const generateZScoreDistribution = (anomalyData: any[], sensitivityLevel: number = 2) => {
  if (!anomalyData || anomalyData.length === 0) {
    return [];
  }

  // Create bins for Z-Score distribution
  const bins = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  // Count data points in each bin
  const distribution = bins.map(bin => {
    const count = anomalyData.filter(item =>
      item.zScore >= bin && item.zScore < bin + 1
    ).length;

    return {
      bin: bin < 0 ? `${bin} to ${bin + 1}` : `${bin} to ${bin + 1}`,
      count,
      isAnomaly: Math.abs(bin) >= sensitivityLevel
    };
  });

  return distribution;
};

/**
 * Calculates statistics for each field
 */
const calculateFieldStats = (data: any[]) => {
  const fields = Object.keys(data[0]);
  const fieldStats: any[] = [];

  fields.forEach(field => {
    const values = data.map(row => row[field]);
    const numericValues = values
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));

    if (numericValues.length > 0) {
      // Field has numeric values
      fieldStats.push({
        field,
        type: 'numeric',
        values: {
          mean: mean(numericValues),
          median: median(numericValues),
          stdDev: standardDeviation(numericValues),
          min: min(numericValues),
          max: max(numericValues),
        },
        trend: generateTrendData(numericValues),
      });
    } else {
      // Field has categorical values
      const valueCounts: Record<string, number> = {};
      values.forEach(val => {
        const strVal = String(val);
        valueCounts[strVal] = (valueCounts[strVal] || 0) + 1;
      });

      fieldStats.push({
        field,
        type: 'categorical',
        values: {
          uniqueCount: Object.keys(valueCounts).length,
          mostCommon: Object.entries(valueCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([value, count]) => ({ value, count })),
        },
      });
    }
  });

  return fieldStats;
};

/**
 * Generates trend data for visualization
 */
const generateTrendData = (values: number[]) => {
  // Take 10 samples across the data for trend visualization
  const result = [];
  const step = Math.max(1, Math.floor(values.length / 10));

  for (let i = 0; i < values.length; i += step) {
    if (result.length < 10) {
      result.push({ value: values[i] });
    }
  }

  return result;
};

/**
 * Calculates correlations between numeric fields
 */
const calculateCorrelations = (data: any[]) => {
  const numericFields = getNumericFields(data);
  const correlations: { source: string; target: string; value: number }[] = [];

  for (let i = 0; i < numericFields.length; i++) {
    for (let j = i + 1; j < numericFields.length; j++) {
      const field1 = numericFields[i];
      const field2 = numericFields[j];

      const correlation = calculatePearsonCorrelation(
        data.map(row => parseFloat(row[field1])).filter(val => !isNaN(val)),
        data.map(row => parseFloat(row[field2])).filter(val => !isNaN(val))
      );

      if (!isNaN(correlation)) {
        correlations.push({
          source: field1,
          target: field2,
          value: correlation,
        });
      }
    }
  }

  return correlations;
};

/**
 * Calculates Pearson correlation coefficient between two arrays
 */
const calculatePearsonCorrelation = (x: number[], y: number[]) => {
  if (x.length !== y.length || x.length === 0) {
    return NaN;
  }

  const n = x.length;
  const xMean = mean(x);
  const yMean = mean(y);

  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;

    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }

  if (xDenominator === 0 || yDenominator === 0) {
    return 0;
  }

  return numerator / Math.sqrt(xDenominator * yDenominator);
};

/**
 * Calculates distributions for each field
 */
const calculateDistributions = (data: any[]) => {
  const fields = Object.keys(data[0]);
  const distributions: any[] = [];

  fields.forEach(field => {
    const values = data.map(row => row[field]);
    const numericValues = values
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));

    if (numericValues.length > 0) {
      // For numeric fields, create a histogram
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const range = max - min;
      const binCount = 5; // Number of bins for the histogram
      const binSize = range / binCount;

      const bins = Array(binCount).fill(0);

      numericValues.forEach(val => {
        const binIndex = Math.min(
          binCount - 1,
          Math.floor((val - min) / binSize)
        );
        bins[binIndex]++;
      });

      distributions.push({
        name: field,
        distribution: bins,
      });
    } else {
      // For categorical fields, count occurrences of each value
      const valueCounts: Record<string, number> = {};
      values.forEach(val => {
        const strVal = String(val);
        valueCounts[strVal] = (valueCounts[strVal] || 0) + 1;
      });

      // Get top 5 categories
      const topCategories = Object.entries(valueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      distributions.push({
        name: field,
        distribution: topCategories.map(([_, count]) => count),
        categories: topCategories.map(([value]) => value),
      });
    }
  });

  return distributions;
};

/**
 * Gets numeric fields from the dataset
 */
const getNumericFields = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const fields = Object.keys(data[0]);
  return fields.filter(field => {
    const values = data.map(row => row[field]);
    const numericValues = values
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));

    // Consider a field numeric if at least 70% of values are numeric
    return numericValues.length >= values.length * 0.7;
  });
};

/**
 * Generates insights from the analyzed data
 */
export const generateInsights = (data: any[], analysisResults: any) => {
  const insights = [];

  // Check for missing data
  if (analysisResults.summary.missingValues > 0) {
    const missingPercentage = (analysisResults.summary.missingValues /
      (analysisResults.summary.rowCount * analysisResults.summary.columnCount)) * 100;

    insights.push({
      id: 'missing-data',
      type: 'warning',
      title: 'Dữ liệu thiếu',
      description: `Phát hiện ${missingPercentage.toFixed(1)}% giá trị thiếu trong dữ liệu. Cân nhắc xử lý trước khi phân tích.`,
      field: 'all',
      icon: 'AlertTriangle',
      chartData: [
        { name: 'Có giá trị', value: 100 - missingPercentage },
        { name: 'Thiếu giá trị', value: missingPercentage }
      ],
      chartType: 'pie'
    });
  }

  // Check for outliers
  if (analysisResults.summary.outliers > 0) {
    const outlierPercentage = (analysisResults.summary.outliers / analysisResults.summary.rowCount) * 100;

    insights.push({
      id: 'outliers',
      type: 'warning',
      title: 'Giá trị ngoại lệ',
      description: `Phát hiện ${analysisResults.summary.outliers} giá trị ngoại lệ (${outlierPercentage.toFixed(1)}% dữ liệu). Cân nhắc kiểm tra hoặc loại bỏ.`,
      field: 'all',
      icon: 'AlertCircle',
      chartData: [
        { name: 'Dữ liệu bình thường', value: 100 - outlierPercentage },
        { name: 'Giá trị ngoại lệ', value: outlierPercentage }
      ],
      chartType: 'pie'
    });
  }

  // Check for strong correlations
  analysisResults.correlations.forEach(correlation => {
    if (Math.abs(correlation.value) > 0.7) {
      insights.push({
        id: `correlation-${correlation.source}-${correlation.target}`,
        type: 'trend',
        title: `Tương quan mạnh: ${correlation.source} & ${correlation.target}`,
        description: `Phát hiện tương quan ${correlation.value > 0 ? 'dương' : 'âm'} mạnh (r = ${correlation.value.toFixed(2)}) giữa ${correlation.source} và ${correlation.target}.`,
        field: correlation.source,
        icon: 'TrendingUp',
        chartData: data.map(row => ({
          x: parseFloat(row[correlation.source]),
          y: parseFloat(row[correlation.target])
        })).filter(point => !isNaN(point.x) && !isNaN(point.y)),
        chartType: 'scatter'
      });
    }
  });

  // Check for skewed distributions
  analysisResults.fieldStats.forEach(stat => {
    if (stat.type === 'numeric') {
      const { mean, median, stdDev } = stat.values;

      // Check for skewness
      if (Math.abs(mean - median) > stdDev * 0.5) {
        insights.push({
          id: `skewed-${stat.field}`,
          type: 'info',
          title: `Phân phối lệch: ${stat.field}`,
          description: `Trường ${stat.field} có phân phối lệch ${mean > median ? 'phải' : 'trái'} (mean = ${mean.toFixed(2)}, median = ${median.toFixed(2)}).`,
          field: stat.field,
          icon: 'BarChart3',
          chartData: analysisResults.distributions.find(d => d.name === stat.field)?.distribution.map((value, index) => ({
            range: `Nhóm ${index + 1}`,
            value
          })) || [],
          chartType: 'bar'
        });
      }
    }
  });

  return insights;
};

/**
 * Generates prediction data based on historical data
 */
export const generatePredictionData = (data: any[], field: string, predictionPeriod: number, predictionModel: string) => {
  // Extract numeric values for the selected field
  const values = data
    .map(row => parseFloat(row[field]))
    .filter(val => !isNaN(val));

  if (values.length === 0) {
    return [];
  }

  // Use the last 12 values or all if less than 12
  const historicalData = values.slice(-12);
  const historicalPoints = historicalData.map((value, index) => ({
    month: `T${index + 1}`,
    actual: value,
    predicted: undefined,
    upperBound: undefined,
    lowerBound: undefined,
    isHistorical: true
  }));

  // Generate prediction based on the selected model
  const predictionPoints = [];
  const lastValue = historicalData[historicalData.length - 1];

  for (let i = 0; i < predictionPeriod; i++) {
    let predicted;
    let uncertainty;

    if (predictionModel === 'linear') {
      // Simple linear trend
      const slope = calculateLinearTrend(historicalData);
      predicted = lastValue + slope * (i + 1);
      uncertainty = Math.abs(slope) * (i + 1) * 0.2;
    } else if (predictionModel === 'exponential') {
      // Simple exponential growth
      const growthRate = calculateExponentialGrowth(historicalData);
      predicted = lastValue * Math.pow(growthRate, i + 1);
      uncertainty = predicted * 0.2;
    } else if (predictionModel === 'seasonal') {
      // Simple seasonal model (using average growth + seasonal component)
      const slope = calculateLinearTrend(historicalData);
      const seasonalIndex = (historicalData.length + i) % 4;
      const seasonalComponent = calculateSeasonalComponent(historicalData)[seasonalIndex];
      predicted = lastValue + slope * (i + 1) + seasonalComponent;
      uncertainty = Math.abs(slope + seasonalComponent) * 0.2;
    }

    predictionPoints.push({
      month: `T${historicalData.length + i + 1}`,
      actual: undefined,
      predicted,
      upperBound: predicted + uncertainty,
      lowerBound: predicted - uncertainty,
      isHistorical: false
    });
  }

  return [...historicalPoints, ...predictionPoints];
};

/**
 * Calculates linear trend (slope) from historical data
 */
const calculateLinearTrend = (data: number[]) => {
  if (data.length < 2) return 0;

  const n = data.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const xMean = mean(indices);
  const yMean = mean(data);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (indices[i] - xMean) * (data[i] - yMean);
    denominator += Math.pow(indices[i] - xMean, 2);
  }

  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calculates exponential growth rate from historical data
 */
const calculateExponentialGrowth = (data: number[]) => {
  if (data.length < 2) return 1;

  // Calculate average growth rate
  let sumGrowth = 0;
  let countGrowth = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i - 1] !== 0) {
      sumGrowth += data[i] / data[i - 1];
      countGrowth++;
    }
  }

  return countGrowth === 0 ? 1.05 : sumGrowth / countGrowth;
};

/**
 * Calculates seasonal components from historical data
 */
const calculateSeasonalComponent = (data: number[]) => {
  // Simplified seasonal decomposition (assuming 4 seasons)
  const seasonCount = Math.min(4, data.length);
  const seasonalComponents = Array(seasonCount).fill(0);

  // Calculate detrended data
  const trend = data.map((_, i) => {
    const start = Math.max(0, i - 1);
    const end = Math.min(data.length - 1, i + 1);
    const values = data.slice(start, end + 1);
    return mean(values);
  });

  const detrended = data.map((value, i) => value - trend[i]);

  // Calculate seasonal components
  for (let i = 0; i < data.length; i++) {
    const seasonIndex = i % seasonCount;
    seasonalComponents[seasonIndex] += detrended[i] / Math.ceil(data.length / seasonCount);
  }

  return seasonalComponents;
};
