let heroWrapper;
let heroContent;
let headerSection;
let headerLinks;
const maxScroll = 300;

document.addEventListener('DOMContentLoaded', () => {
    heroWrapper = document.getElementsByTagName('main')[0];
    heroContent = document.getElementById('main-content');
    headerSection = document.getElementsByTagName('header')[0];
    headerLinks = headerSection.getElementsByClassName('nav-link-href');
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / maxScroll, 1);

    const scale = 1 - progress * 0.3;
    const radius = progress * 24;

    heroContent.style.transform = `scale(${scale})`;
    heroContent.style.borderRadius = `${radius}px`;

    if (scrollY >= maxScroll) {
        heroWrapper.style.position = 'relative';
        heroWrapper.style.height = 'auto';
        headerSection.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        headerSection.style.color = 'black';
        for (let link of headerLinks) {
            link.style.color = 'black';
        }
    } else {
        heroWrapper.style.position = 'fixed';
        heroWrapper.style.top = '0';
        heroWrapper.style.height = '100vh';
        headerSection.style.backgroundColor = 'transparent';
        headerSection.style.color = 'white';
        for (let link of headerLinks) {
            link.style.color = 'white';
        }
    }
});