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
 * @returns {Number} 引数の要素が何番目か
 */
function getOpenUMLBtnIndex(btnElm) {
    const elms = Array.from(document.querySelectorAll('.openUMLBtn'));
    return elms.indexOf(btnElm);  
}

/**
 * 引数で与えられた umlIndex 番目（0始まり）の UML の data URI を取得する
 * @param {Number} umlIndex 開くUMLの番号（0始まり、ページの上から数える）
 * @returns {String} umlIndex 番目（0始まり）の UML の data URI
 */
function getUmlDataUrl(umlIndex) {
    return document.querySelectorAll('.plantuml')[umlIndex].querySelector('img').src;
}

/**
 * データURLの画像を新しいタブで開く
 * @param {String} dataUri 別タブで開く画像のdataURI
 */
function openDataImage(dataUri) {

    // base64dataを取得 取得不可なら終了
    const base64data = getBase64DataFromSvgXmlImgDataUri(dataUri);
    if(!base64data) return;

    const newTab         = window.open('about:blank');
    const decodedUtf8str = atob(base64data);
    const decodedArray   = new Uint8Array(Array.prototype.map.call(decodedUtf8str, c => c.charCodeAt()));
    const decodedData    = new TextDecoder().decode(decodedArray);
    newTab.document.querySelector('body').innerHTML += decodedData;
    
    // URLを見つけたとき、リンクを貼る。
    for(const t of newTab.document.querySelectorAll('g > text')){
        const matchedUrls = t.innerHTML.match(URL_REGEXP_PTN);

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
    const umlIndex   = getOpenUMLBtnIndex(btnElm);
    openUMLImagePage(umlIndex);
}

/**
 * UML図を別タブで開くボタンを設置する
 */
function putOpenUMLBtns() {
    // 多重設置防止
    if(document.querySelectorAll('.openUMLBtn').length > 0) return;
    
    // 各UMLにボタン設置
    for(const umlElm of document.querySelectorAll('.plantuml')){
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

/**
 * クエリパラメータ取得
 * @param  {String} key {string} パラメータのキー文字列
 */
function getParam(key) {
    const url     = window.location.href;
    const regex   = new RegExp("[?&]" + key.replace(/[\[\]]/g, "\\$&") + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * パラメータで指定された番号のUMLを開く
 * 引数なしで実行すると、クエリパラメータの'openUml'の値を用いる
 * @param {Number} umlIndex 開くUMLの番号（0始まり、ページの上から数える）
 */
function openUMLImagePage(umlIndex = Number(getParam('openUml'))) {
    try {
        const dataUri = getUmlDataUrl(umlIndex);
        openDataImage(dataUri);
    } catch(e) {
        console.error(`パラメータが不正です\n param:${umlIndex}\n error:${e}`);
    } 
}

/**
 * パラメータのdataURIからbase64のdata部分を取り出し返す。
 * パラメータがdataURL(svg+xml)以外のときはnullを返す。
 * @param {String} src 調べたい画像ソース
 * @returns {string|null}
 */
function getBase64DataFromSvgXmlImgDataUri(src) {
    const dataUriMatchResult = src.match(/data\:image\/svg\+xml\;(.*)base64,(.*)/);
    if(!dataUriMatchResult) return null;
    return dataUriMatchResult[2];
}

putOpenUMLBtns();
// URLパラメータで開くUMLが指定されているとき、UMLを開く
if(getParam('openUml')) openUMLImagePage();
