"use client";

// Utility function to get an abbreviated team name, primarily using the logoIdentifier.
export const getAbbreviatedTeamName = (teamName: string, logoIdentifier: string): string => {
  // For consistency, we'll use the logoIdentifier as the primary abbreviation.
  // If logoIdentifier is not suitable (e.g., too long, or not provided),
  // we can fall back to a simple truncation of the full name.
  if (logoIdentifier && logoIdentifier.length <= 5) { // Assuming 5 characters is a reasonable max for abbreviation
    return logoIdentifier;
  }
  // Fallback to first three letters if logoIdentifier is not ideal or missing
  return teamName.substring(0, 3).toUpperCase();
};