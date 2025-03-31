import { Paper } from '../../paper/models/paper';

export interface TopicFilter {
  domain?: string;
  keywords?: string[];
  authorName?: string;
  dateRange?: string; // 'week', 'month', 'year', 'all'
}

export interface DiscoveryData {
  recommendedPapers: Paper[];
  trendingPapers: Paper[];
  latestPapers: Paper[];
  relatedPapers: Paper[];
}

export enum DateRange {
  Week = 'week',
  Month = 'month',
  Year = 'year',
  All = 'all'
} 