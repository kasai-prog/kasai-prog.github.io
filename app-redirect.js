(function() {
    // 【設定箇所】暗号化された宛先URL（パラメータ引き継ぎのベースとなるURL）
    // デコード結果: https://api.yomsubi.com/kasai/4d224a5a1cd9281534a86032eb9b4649?tm=8wnvN4lBoTaWDUZIjL9kMtzpf563
    const BASE64_UNIVERSAL_LINK = "aHR0cHM6Ly9hcGkueW9tc3ViaS5jb20va2FzYWkvNGQyMjRhNWExY2Q5MjgxNTM0YTg2MDMyZWI5YjQ2NDk/dG09OHdudk40bEJvVGFXRFVaSWpMOWtNdHpwZjU2Mw=="; 

    // 現在のページのクエリパラメータ（もしあれば。例: &user_id=123 など）を取得
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
            // 現在のクエリが「?」で始まっていて、ベースURLにも既に「?」がある場合は「&」で繋ぐ
            const separator = baseUrl.indexOf('?') !== -1 ? '&' : '?';
            // 重複を防ぐため、現在のクエリの先頭の「?」を削除して結合
            targetUrl += separator + currentQuery.substring(1);
        }

        // ユーザーの環境（OS）を確認
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1;

        if (isAndroid) {
            // 【Android対策】
            // 自動遷移だとWebViewにブロックされますが、ボタンのhrefに直接Intentを設定しておくことで、
            // タップした瞬間にアプリ内WebViewからChromeブラウザへ強制的脱出を図ります。
            // ※URLから「https://」を取り除いたドメイン＋パス部分を取り出します。
            const rawUrlWithoutProtocol = targetUrl.replace(/^https?:\/\//, '');
            
            // Intentスキームの組み立て
            appLinkBtn.href = `intent://${rawUrlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;end;`;
        } else {
            // 【iOS対策】
            // ユーザー自身のタップ操作（手動起動）であれば、LINEやXなどの強力なWebView内からであっても
            // ユニバーサルリンク（App起動）が正常に発火します。
            appLinkBtn.href = targetUrl;
        }
    });
})();
