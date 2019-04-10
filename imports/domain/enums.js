export const AchievementStatus = {
  NOT_ACQUIRED: 0,
  NEWLY_ACQUIRED: 1,
  ACQUIRED: 2,
  DECORATED: 3,
  acquired(status) {
    return [
      AchievementStatus.NEWLY_ACQUIRED,
      AchievementStatus.ACQUIRED,
      AchievementStatus.DECORATED,
    ].includes(status);
  },
};
