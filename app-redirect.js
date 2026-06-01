(function() {
    // 【設定箇所】暗号化された宛先URL（パラメータ引き継ぎのベースとなるURL）
    const BASE64_UNIVERSAL_LINK = "aHR0cHM6Ly9hcGkueW9tc3ViaS5jb20va2FzYWkvNGQyMjRhNWExY2Q5MjgxNTM0YTg2MDMyZWI5YjQ2NDk/dG09OHdudk40bEJvVGFXRFVaSWpMOWtNdHpwZjU2Mw==";

    // 現在のページのクエリパラメータ（もしあれば）を取得
    const currentQuery = window.location.search;

    // Base64をデコードして本来のURLを復元する関数
    const getDecodedUrl = (base64Str) => {
        return decodeURIComponent(escape(window.atob(base64Str)));
    };

    // ページ読み込み完了時の処理
    window.addEventListener('DOMContentLoaded', () => {
        const appLinkBtn = document.getElementById('app-link');
        if (!appLinkBtn) return;

        // 本来の遷移先URLを復元
        const baseUrl = getDecodedUrl(BASE64_UNIVERSAL_LINK);
        
        // 遷移先URLに現在のクエリパラメータを綺麗に結合する処理
        let targetUrl = baseUrl;
        if (currentQuery) {
            const separator = baseUrl.indexOf('?') !== -1 ? '&' : '?';
            targetUrl += separator + currentQuery.substring(1);
        }

        // ユーザーの環境（OS）を確認
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1;

        if (isAndroid) {
            // URLから「https://」を取り除いたドメイン＋パス部分を取り出します
            const rawUrlWithoutProtocol = targetUrl.replace(/^https?:\/\//, '');
            const intentUrl = `intent://${rawUrlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;end;`;

            // ボタンのリンク先に、Chrome経由でアプリを開く特殊なURL（Intent）を設定
            appLinkBtn.href = intentUrl;

            // 【超重要：らくらくスマホ対策】
            // もし「らくらくブラウザ」やLINE内ブラウザなどの通常Chrome以外の環境でこのページを開いていた場合、
            // ユーザーが「ボタンを押した瞬間」に、強制的に通常のGoogle Chromeを召喚してアプリを開くようにイベントを設定します。
            const isChrome = ua.indexOf("chrome") > -1 && ua.indexOf("chromium") === -1;
            if (!isChrome) {
                appLinkBtn.addEventListener('click', (e) => {
                    e.preventDefault(); // 通常のクリック挙動を一瞬止める
                    const currentUrl = window.location.href.replace(/^https?:\/\//, "");
                    // 一度通常のChromeでこのページを開き直させます。開き直されたChromeで再度ボタンを押せば確実にアプリが開きます。
                    window.location.href = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end;`;
                });
            }

        } else {
            // 【iOS対策】iPhoneの場合は通常のユニバーサルリンクをボタンに設定
            appLinkBtn.href = targetUrl;
        }
    });
})();
