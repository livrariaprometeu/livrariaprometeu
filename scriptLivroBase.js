// Elementos DOM
const readerDiv = document.getElementById('reader');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const fontSmaller = document.getElementById('font-smaller');
const fontLarger = document.getElementById('font-larger');
const toggleTheme = document.getElementById('toggle-theme');
const chapterSelector = document.getElementById('chapter-selector');
const adContainer = document.getElementById('ad-container');
const closeAd = document.getElementById('close-ad');
const chapterTitle = document.getElementById('chapter-title');

// Caminho do arquivo EPUB local
const epubUrl = 'livros/DomCasmurro_MachadoAssis.epub'; // Ajuste para o seu arquivo

let book; // Objeto EPUB.js
let rendition; // Objeto de renderização
let currentLocation; // Localização atual no livro
let fontSize = 16; // Tamanho inicial da fonte (px)
let isDarkTheme = false; // Estado do tema
let lastChapter = null; // Último capítulo exibido
let toc = []; // Armazena a tabela de conteúdos (TOC)

// Função para carregar e renderizar o EPUB
function loadBook(data) {
    console.log('Inicializando EPUB.js com dados:', data.byteLength);
    book = ePub(data);
    rendition = book.renderTo('reader', {
        width: '100%',
        height: '100%',
        spread: 'none', // Uma página por vez
        flow: 'paginated',
        allowScriptedContent: true
    });

    // Definir tema inicial
    rendition.themes.register('custom', {
        body: {
            'font-family': 'Georgia, serif',
            'font-size': `${fontSize}px`,
            'line-height': '1.5',
            'margin': '20px',
            'color': isDarkTheme ? '#f0f0f0' : '#000000',
            'background-color': isDarkTheme ? '#2c2c2c' : '#ffffff'
        }
    });
    rendition.themes.select('custom');

    // Renderiza a primeira página
    rendition.display().then(() => {
        console.log('Primeira página renderizada');
        updateNavigation();
    }).catch(err => console.error('Erro ao renderizar:', err));

    // Detecta mudança de página e verifica capítulo
    rendition.on('relocated', (location) => {
        currentLocation = location;
        checkChapterChange(location);
        updateNavigation();
        updateChapterTitle(location);
    });

    // Carrega metadados
    book.loaded.metadata.then((metadata) => {
        console.log('Título do livro:', metadata.title);
    });

    // Carrega tabela de conteúdos (TOC)
    book.loaded.navigation.then((navigation) => {
        toc = navigation.toc;
        toc.forEach((chapter) => {
            const option = document.createElement('option');
            option.value = chapter.href;
            option.textContent = chapter.label || 'Capítulo sem título';
            chapterSelector.appendChild(option);
        });
    });
}

// Verifica se houve mudança de capítulo
function checkChapterChange(location) {
    const currentChapter = location.start.href;
    if (currentChapter !== lastChapter && lastChapter !== null) {
        showAd(() => {
            lastChapter = currentChapter;
        });
    } else {
        lastChapter = currentChapter;
    }
}

// Atualiza o título do capítulo atual
function updateChapterTitle(location) {
    const currentHref = location.start.href;
    const currentChapter = toc.find(chapter => chapter.href === currentHref || currentHref.startsWith(chapter.href));
    if (currentChapter) {
        chapterTitle.textContent = `Capítulo Atual: ${currentChapter.label || 'Sem Título'}`;
    } else {
        chapterTitle.textContent = 'Capítulo Atual: Desconhecido';
    }
}

// Exibe o anúncio
function showAd(callback) {
    adContainer.style.display = 'flex';
    readerDiv.style.display = 'none';
    const autoClose = setTimeout(() => {
        closeAdFunction(callback);
    }, 5000);
    closeAd.onclick = () => {
        clearTimeout(autoClose);
        closeAdFunction(callback);
    };
}

// Fecha o anúncio
function closeAdFunction(callback) {
    adContainer.style.display = 'none';
    readerDiv.style.display = 'block';
    if (callback) callback();
}

// Atualiza botões de navegação e informações de página
function updateNavigation() {
    const { start } = currentLocation;
    pageInfo.textContent = `Página ${start.displayed.page} de ${start.displayed.total}`;
    prevButton.disabled = !rendition.book.locations.hasPrevious();
    nextButton.disabled = !rendition.book.locations.hasNext();
}

// Navegação entre páginas
prevButton.addEventListener('click', () => {
    rendition.prev();
});

nextButton.addEventListener('click', () => {
    rendition.next();
});

// Controles de personalização
fontSmaller.addEventListener('click', () => {
    if (fontSize > 12) {
        fontSize -= 2;
        updateTheme();
    }
});

fontLarger.addEventListener('click', () => {
    if (fontSize < 24) {
        fontSize += 2;
        updateTheme();
    }
});

toggleTheme.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
    toggleTheme.textContent = isDarkTheme ? 'Modo Claro' : 'Modo Noturno';
    updateTheme();
});

chapterSelector.addEventListener('change', (e) => {
    if (e.target.value) {
        showAd(() => {
            rendition.display(e.target.value);
        });
    }
});

// Atualiza o tema do EPUB
function updateTheme() {
    rendition.themes.register('custom', {
        body: {
            'font-family': 'Georgia, serif',
            'font-size': `${fontSize}px`,
            'line-height': '1.5',
            'margin': '20px',
            'color': isDarkTheme ? '#f0f0f0' : '#000000',
            'background-color': isDarkTheme ? '#2c2c2c' : '#ffffff'
        }
    });
    rendition.themes.select('custom');
    rendition.display(currentLocation.start.cfi);
}

// Carrega EPUB automaticamente
async function loadEpubFromUrl(url) {
    try {
        console.log('Tentando carregar EPUB de:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        console.log('EPUB carregado com sucesso, tamanho:', arrayBuffer.byteLength);
        loadBook(arrayBuffer);
    } catch (error) {
        console.error('Erro ao carregar EPUB:', error);
        alert('Não foi possível carregar o arquivo EPUB: ' + error.message);
    }
}

// Responsividade: Re-renderiza ao redimensionar
window.addEventListener('resize', debounce(() => {
    if (rendition) {
        rendition.resize();
        rendition.display(currentLocation.start.cfi);
    }
}, 300));

// Função debounce
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

// Inicia o carregamento do EPUB
loadEpubFromUrl(epubUrl);