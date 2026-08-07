/*
 * Sincronizza l'altezza di ogni .nav-category con l'altezza del suo
 * .project-group corrispondente (stesso indice, stesso ordine nel DOM).
 *
 * Questo e' cio' che rende preciso il cambio di categoria: la categoria N
 * nella nav resta agganciata (position: sticky) esattamente per tutta la
 * lunghezza dello scroll del gruppo di progetti N, poi lascia il posto alla
 * categoria N+1.
 */
(function () {
    function syncNavCategoryHeights() {
        var groups = document.querySelectorAll('#main-navaside .project-group');
           var navSpacers = document.querySelectorAll('main nav .nav-category-spacer');

        if (groups.length !== navSpacers.length) {
            console.warn(
                '[nav-sticky] Il numero di .nav-category-spacer (' + navSpacers.length +
                ') non corrisponde al numero di .project-group (' + groups.length +
                '). Controlla che ci sia uno spacer per ogni .project-group, nello stesso ordine.'
            );
        }

        groups.forEach(function (group, i) {
            var navSpacer = navSpacers[i];
            if (navSpacer) {
                navSpacer.style.minHeight = group.offsetHeight + 'px';
            }
        });
    }
 
    // Prima stima appena il DOM e' pronto (prima che le immagini siano caricate)
    document.addEventListener('DOMContentLoaded', syncNavCategoryHeights);
 
    // Valore definitivo una volta che tutte le immagini hanno la loro altezza reale
    window.addEventListener('load', syncNavCategoryHeights);
 
    // Ricalcola su resize (layout responsive, cambi di viewport, ecc.)
    var resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(syncNavCategoryHeights, 150);
    });
 
    // Ricalcola man mano che le singole immagini finiscono di caricare,
    // nel caso il loro caricamento sia piu' lento del load event globale
    document.querySelectorAll('#projects img').forEach(function (img) {
        if (!img.complete) {
            img.addEventListener('load', syncNavCategoryHeights);
        }
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncNavCategoryHeights);
    }
})();