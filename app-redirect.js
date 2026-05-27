(function() {
    // 【設定箇所】パッと見でURLと分からないようにBase64で難読化して定義します
    // ※ 以下の文字列はサンプルです。ご自身のURLをBase64変換したものに差し替えてください。
    const BASE64_UNIVERSAL_LINK = "aHR0cHM6Ly9hcGkueW9tc3ViaS5jb20va2FzYWkvNGQyMjRhNWExY2Q5MjgxNTM0YTg2MDMyZWI5YjQ2NDk/dG09OHdudk40bEJvVGFXRFVaSWpMOWtNdHpwZjU2Mw=="; 
    const BASE64_INTENT_DOMAIN  = "XBpLnlvbXN1YmkuY29tL2thc2FpLzRkMjI0YTVhMWNkOTI4MTUzNGE4NjAzMmViOWI0NjQ5P3RtPTh3bnZONGxCb1RhV0RVWklqTDlrTXR6cGY1NjM=";          // 

    // ページのクエリパラメータ（?point=100&token=xyz など）を取得
    const currentQuery = window.location.search;

    // Base64をデコードして本来のURLを復元する関数
    const getDecodedUrl = (base64Str) => {
        return decodeURIComponent(escape(window.atob(base64Str)));
    };

    // 復元したURLにパラメータを結合
    const appUniversalLink = getDecodedUrl(BASE64_UNIVERSAL_LINK) + currentQuery;

    // ページが読み込まれた時の処理
    window.addEventListener('DOMContentLoaded', () => {
        // HTMLのボタン要素を取得し、復元したURLをセット
        const appLinkBtn = document.getElementById('app-link');
        if (appLinkBtn) {
            appLinkBtn.href = appUniversalLink;
        }

        // ユーザー環境（OS）の判定
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1;

        if (isAndroid) {
            // Android用のIntentスキームを組み立てて自動リダイレクト
            const intentDomain = getDecodedUrl(BASE64_INTENT_DOMAIN);
            const intentUrl = `intent://${intentDomain}${currentQuery}#Intent;scheme=https;package=com.android.chrome;end;`;
            
            // 自動でAndroidアプリ（またはChrome経由）を開く
            window.location.href = intentUrl;
        } else {
            // iOSなどの場合は、ユニバーサルリンクへ自動リダイレクト
            window.location.href = appUniversalLink;
        }
    });
})();