export interface Rating {
  value: number; // The user's rating value (1-5)
  count: number; // Total number of ratings
  average: number; // Average rating value
  distribution?: RatingDistribution; // Optional rating distribution
}

export interface RatingDistribution {
  1: number; // Number of 1-star ratings
  2: number; // Number of 2-star ratings
  3: number; // Number of 3-star ratings
  4: number; // Number of 4-star ratings
  5: number; // Number of 5-star ratings
} 