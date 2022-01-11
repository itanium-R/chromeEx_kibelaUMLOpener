const NEW_TAB_ICON_HTML = `<svg style="width:20px;height:20px;fill:#666;" focusable="false"><use xlink:href="#ks-fullwidth-open"></use></svg>`;

/**
 * 引数のボタン要素が何番目のOpenUMLBtnかを返す
 * @param {Element} btnElm OpenUMLBtnElement
 * @returns {Nunber} 引数の要素が何番目か
 */
function getOpenUMLBtnIndex(btnElm) {
    const elms = Array.from(document.querySelectorAll('.openUMLBtn'));
    return elms.indexOf(btnElm);  
}

/**
 * データURLの画像を新しいタブで開く
 * @param {String} dataUrl 別タブで開く画像のdataURL
 */
function openDataImage(dataUrl) {
    const w = window.open('about:blank');
    w.document.write(`<style>*{margin:0;padding:0;width:100vw;height:100vh;border:0;}</style><iframe src='${dataUrl}'>`);
}

/**
 * 引数で指定したボタンに対応するUML画像を開く
 * @param {Element} btnElm OpenUMLBtnElement
 */
function openUML(btnElm) {
    const index = getOpenUMLBtnIndex(btnElm);
    const dataUrl = btnElm.parentElement.parentElement.querySelectorAll('img')[index].src;
    openDataImage(dataUrl);
}

/**
 * UML図を別タブで開くボタンを設置する
 */
function putOpenUMLBtns() {
    for(umlElm of document.querySelectorAll('.plantuml')){
        btnElm = document.createElement('button');
        btnElm.innerHTML      = NEW_TAB_ICON_HTML;
        btnElm.className      = 'openUMLBtn';
        btnElm.style.position = 'absolute';
        btnElm.style.top      = '0';
        btnElm.style.right    = '0';
        btnElm.style.border   = '0';
        btnElm.style.background = 'none';
        btnElm.addEventListener('click', function(){openUML(this)}, false);
        umlElm.style.position      = 'relative';
        umlElm.append(btnElm);
    }
}

putOpenUMLBtns();