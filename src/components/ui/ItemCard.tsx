
/**
 * ItemCard Component
 * @param {React.ReactNode} children - Les enfants du composant.
 * @param {string} className - La classe CSS supplémentaire.
 * @returns {JSX.Element} Le composant carte d'élément.
 */
 export const ItemCard = ({children , className}: {children: React.ReactNode, className?: string}) => {
    return (
        <div className={`bg-slate-700 dark:bg-sky-800 rounded-md px-3 pt-3 pb-1 text-white relative shadow-md shadow-slate-400 dark:shadow-sky-400 border-opacity-65 ${className}`}>
            {children}
        </div>
    )
 }



 /**
 * ItemCardInner Component
 * @param {React.ReactNode} children - Les enfants du composant.
 * @param {string} className - La classe CSS supplémentaire.
 * @returns {JSX.Element} Le composant conteneur interne de carte d'élément.
 */
 export const ItemCardInner = ({children , className}: {children: React.ReactNode, className?: string}) => {
    return (
        <div className={`p-2 rounded-md bg-sky-500/10 shadow-inner shadow-sky-500/20 ${className}`}>
            {children}
        </div>
    )
 }


 /**
 * ItemCardHeader Component
 * @param {React.ReactNode} children - Les enfants du composant.
 * @param {string} className - La classe CSS supplémentaire.
 * @returns {JSX.Element} Le composant en-tête de carte d'élément.
 */
 export const ItemCardHeader = ({children , className}: {children: React.ReactNode, className?: string}) => {
    return (
        <div className={`bg-slate-600 dark:bg-sky-950 rounded-md p-2 py-4 shadow-inner shadow-slate-600 ${className}`}>
            {children}
        </div>
    )
 }


 