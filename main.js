const NEW_TAB_ICON_HTML      = `<svg style="width:20px;height:20px;fill:#666;" focusable="false">
                                    <use xlink:href="#ks-fullwidth-open"></use></svg>`;
const IMAGE_PAGE_TEMPLATE    = `<html>
                                    <head>
                                        <style>*{margin:0;padding:0;width:100vw;height:100vh;border:0;}</style>
                                    </head>
                                    <body></body>
                                </html>`;

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
 * データURLの画像を新しいタブでiframeで開く
 * @param {String} dataUrl 別タブで開く画像のdataURL
 */
function openDataImageByIframe(dataUrl) {
    const w = window.open('about:blank');
    const iframeElm  = document.createElement('iframe');
    iframeElm.src    = dataUrl;
    w.document.write(IMAGE_PAGE_TEMPLATE);
    w.document.querySelector('body').append(iframeElm);
}

/**
 * 引数で指定したボタンに対応するUML画像を開く
 * @param {Element} btnElm OpenUMLBtnElement
 */
function openUML(btnElm) {
    const index = getOpenUMLBtnIndex(btnElm);
    const dataUrl = btnElm.parentElement.parentElement.querySelectorAll('img')[index].src;
    openDataImageByIframe(dataUrl);
}

/**
 * UML図を別タブで開くボタンを設置する
 */
function putOpenUMLBtns() {
    // 多重設置防止
    if(document.querySelectorAll('.openUMLBtn').length > 0) return;
    
    // 各UMLにボタン設置
    for(umlElm of document.querySelectorAll('.plantuml')){
        btnElm = document.createElement('button');
        btnElm.innerHTML        = NEW_TAB_ICON_HTML;
        btnElm.className        = 'openUMLBtn';
        btnElm.style.position   = 'absolute';
        btnElm.style.top        = '0';
        btnElm.style.right      = '0';
        btnElm.style.border     = '0';
        btnElm.style.background = 'none';
        btnElm.addEventListener('click', function(){openUML(this)}, false);
        umlElm.style.position   = 'relative';
        umlElm.append(btnElm);
    }
}

putOpenUMLBtns();