const NEW_TAB_ICON_HTML      = `<svg style="width:20px;height:20px;fill:#666;" focusable="false">
                                    <use xlink:href="#ks-fullwidth-open"></use></svg>`;
const IMAGE_PAGE_TEMPLATE    = `<html>
                                    <head>
                                        <style>*{margin:0;padding:0;width:100vw;height:100vh;border:0;}</style>
                                    </head>
                                    <body></body>
                                </html>`;
const URL_REGEXP_PTN         = /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;

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
    const newTab = window.open('about:blank');
    const iframeElm  = document.createElement('iframe');
    iframeElm.src    = dataUrl;
    newTab.document.write(IMAGE_PAGE_TEMPLATE);
    newTab.document.querySelector('body').append(iframeElm);
}


/**
 * データURLの画像を新しいタブで開く
 * @param {String} dataUrl 別タブで開く画像のdataURL
 * @returns 
 */
function openDataImage(dataUrl) {

    // 本関数で解析可能なBASE64なら、data部分を取得する。
    // 取得不可ならdataURLをiframeで開く。
    let parsableBase64Data = dataUrl.match(/data\:image\/svg\+xml\;charset\=utf\-8\;base64,(.*)/);
    if(!parsableBase64Data) {
        openDataImageByIframe(dataUrl);
        return;
    } 
    parsableBase64Data = parsableBase64Data[1];

    const newTab = window.open('about:blank');
    const decodedUtf8str = atob(parsableBase64Data);
    const decodedArray = new Uint8Array(Array.prototype.map.call(decodedUtf8str, c => c.charCodeAt()));
    const decodedData = new TextDecoder().decode(decodedArray);
    newTab.document.querySelector('body').innerHTML += decodedData;
    
    // URLを見つけたとき、リンクを貼る。
    for(t of newTab.document.querySelectorAll('svg > g > text')){
        const matchedUrls = t.innerHTML.match(URL_REGEXP_PTN);

        console.log(t.innerHTML, matchedUrls);

        // 0または2つ以上のリンクがある時はリンクを貼らない。
        if(!matchedUrls || matchedUrls.length !== 1) continue;

        // textのouterにリンク貼る（innerは強制escapeされるため。貼れるリンクは1textにつき1つまで。）
        t.outerHTML = `<a href="${matchedUrls[0]}" target="_blank">${t.outerHTML}</a>`;
    }
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