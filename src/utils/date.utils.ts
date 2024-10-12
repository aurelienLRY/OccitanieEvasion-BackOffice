



/**
 * Retourne le mois en cours en string
 * @returns {string} Le mois en cours en string
 */
export const getMonthString = () => {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const month = new Date().getMonth();
    return months[month];
  }


/**
 * Retourne le mois en cours en string
 * @returns {string} Le mois en cours en string
 */
export const getMonthValue = (month: number) => {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return months[month];
  }

/**
 * Retourne l'année en cours en string
 * @returns {string} L'année en cours en string
 */
export const getYearString = () => {
    const year = new Date().getFullYear();
    return year.toString();
  }

  
/**
 * Format the date to YYYY-MM-DD
 * @param date - The date to format
 * @returns The formatted date
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

