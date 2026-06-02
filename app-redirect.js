(function() {
    // 【設定箇所】暗号化された宛先URL（パラメータ引き継ぎのベースとなるURL）
    const BASE64_UNIVERSAL_LINK = "aHR0cHM6Ly9hcGkueW9tc3ViaS5jb20va2FzYWkvNGQyMjRhNWExY2Q5MjgxNTM0YTg2MDMyZWI5YjQ2NDk/dG09OHdudk40bEJvVGFXRFVaSWpMOWtNdHpwZjU2Mw==";

    // 現在のページのクエリパラメータ（もしあれば）を取得
    const currentQuery = window.location.search;

    // Base64をデコードして本来のURLを復元する関数
    const getDecodedUrl = (base64Str) => {
        return decodeURIComponent(escape(window.atob(base64Str)));
    };

    window.addEventListener('DOMContentLoaded', () => {
        const appLinkBtn = document.getElementById('app-link');
        if (!appLinkBtn) return;

        // ユーザーの環境（OS）を確認
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1;

        if (isAndroid) {
            const isChrome = ua.indexOf("chrome") > -1 && ua.indexOf("chromium") === -1;

            if (!isChrome) {
                // 【A】らくらくブラウザやLINEなどの通常Chrome以外の環境の場合：
                // ボタンの「見た目のリンク先（href）」を、このリダイレクトページ自身をChromeで開く設定にする。
                // これにより、長押しされてもアプリのURLは絶対にバレず、タップした瞬間に確実にChromeへ脱出させます。
                const currentUrl = window.location.href.replace(/^https?:\/\//, "");
                appLinkBtn.href = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end;`;

            } else {
                // 【B】すでに通常のGoogle Chromeに到達している場合：
                // HTML上のhrefは安全のために「#」のままにしておき、クリックされた瞬間にアプリを起動します。
                appLinkBtn.href = "#";
                appLinkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const baseUrl = getDecodedUrl(BASE64_UNIVERSAL_LINK);
                    let targetUrl = baseUrl;
                    if (currentQuery) {
                        const separator = baseUrl.indexOf('?') !== -1 ? '&' : '?';
                        targetUrl += separator + currentQuery.substring(1);
                    }
                    const rawUrlWithoutProtocol = targetUrl.replace(/^https?:\/\//, '');
                    window.location.href = `intent://${rawUrlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;end;`;
                });
            }

        } else {
            // 【C】iPhone（iOS）の場合：
            // HTML上のhrefは「#」のままにしておき、クリックされた瞬間にユニバーサルリンクへジャンプ
            appLinkBtn.href = "#";
            appLinkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const baseUrl = getDecodedUrl(BASE64_UNIVERSAL_LINK);
                let targetUrl = baseUrl;
                if (currentQuery) {
                    const separator = baseUrl.indexOf('?') !== -1 ? '&' : '?';
                    targetUrl += separator + currentQuery.substring(1);
                }
                window.location.href = targetUrl;
            });
        }
    });
})();
