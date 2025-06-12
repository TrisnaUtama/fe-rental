// export function formatDate(date: Date): string {
//     const offset = 7 * 60;
//     const tzDate = new Date(date.getTime() - offset * 60 * 1000);
//     return tzDate.toISOString().replace("Z", "+07:00");
//   }

export const formatDate = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
};