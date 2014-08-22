var num = 1;

$(function() {
	$("#start").click(function() {
		getMyFav(1);
	});
});

function getMyFav(page) {
	if (page == 1) {
		$("#msg").html('<p id="login_check">ログインチェック中…<br><progress></progress></p>');
	}
	$.get("http://www.nicovideo.jp/my/fav/user?page=" + page, function(html) {
		if (html.indexOf('<title>ニコニコ動画　ログインフォーム</title>') == -1) {
			$("table").show();
			$("#start").remove();
			$("#login_check").remove();
			$("#msg").html("お気に入りユーザーのニコレポを取得中…<br><progress></progress>");
			var reg = /<h5><a href="\/user\/([0-9]+)">([^<]+)/g;
			var i = 0;
			while ((m = reg.exec(html)) != null) {
				setTimeout(getUser, i * 2000, m[1], m[2]);
				i++;
			}
			if (i == 20) {
				setTimeout(getMyFav, 2000, page + 1);
				$("#msg").remove();
			} else {
				$("#msg").remove();
			}
		} else {
			var gui = require('nw.gui');
			var login_window = gui.Window.get(
				window.open('https://secure.nicovideo.jp/secure/login_form')
			);
			login_window.requestAttention(true);
			alert("ニコニコ動画にログインしてください！なお、フィッシング詐欺の可能性がありますので、このアプリケーションが信頼出来ない場合はパスワードを入力しないでください。");
			$("#msg").html('<h2>ログインしたら「開始」をクリック！</h2>');
		}
	});
}

function getUser(id, name) {
	var url = "http://www.nicovideo.jp/user/" + id;
	$.get(url, function(html) {
		var time = $($.parseHTML(html)).find(".relative").first();
		if (time.attr("datetime")) {
			var d = Date.parse(time.attr("datetime"));
			var dt = time.text();
		} else {
			var d = 0;
			var dt = '<span class="none">なし</span>';
		}
		$("#tbl").append('<tr><td>' + num + '</td><td><a href="' + url + '" target="_blank">' + name + '</a></td><td data-sort="' + d + '">' + dt + '</td></tr>');
		num++;
	});
}