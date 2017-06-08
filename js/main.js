//初始状态	
var oAudio=$("#audio").get(0);
oAudio.src="http:\/\/mr1.doubanio.com\/d087a35554d58d9dc04485c9b92d423f\/0\/fm\/song\/p749701_128k.mp3";
var mark=0;//当前播放状态为暂停
$(".song-info").text("The Dawn -- Dreamtale");//歌曲名字显示
$(".song-cover img").attr("src","https://img3.doubanio.com\/lpic\/s3346933.jpg")//初始封面
$(".lyric-show").remove();
    
//1.第一次先加载进来15首
var olList=document.getElementById("ol-list");
var firstScript=document.createElement("script");
firstScript.src="json/music-1.json";//调用json格式的音乐
document.body.appendChild(firstScript);

function fn(data){
  var html="";
  var oUl=document.createElement("ul");

  for(var i=0;i<15;i++){
    html+="<li><span>"+data.list[i].index+"</span><a href="+data.list[i].url+">"+data.list[i].title+"--"+data.list[i].singer+"</a><span style="+"display:none"+">"+data.list[i].picture+"</span><span style="+"display:none"+">"+data.list[i].lyric+"</span></li>";
  }

  oUl.innerHTML=html;
  olList.appendChild(oUl);
  olList.appendChild(oA);
  
    //初始列表状态
	$(".right li:eq(0)").addClass("active");
	//初始歌词
	$(".no-lrc").remove();
	var lyricAddress=$(".right .song-list ol li").eq(0).children("span:eq(2)").text();//获取歌词地址 
	if(lyricAddress!=""){
		var htmlobj=$.ajax({url:lyricAddress,async:false}); //获取lyricAddress内容并赋值
		lyric=htmlobj.responseText;
		parseLyric(lyric);//调用显示歌词的函数
	}else{
		var noLrc=$("<a class="+"no-lrc"+">暂无歌词</a>");
		$(".song-lyric").append(noLrc);
	}

    commonPlay();
}

//2.点击加载更多
var oA=document.createElement("a");
oA.innerHTML="加载更多";
oA.className="load-more";
window.onload=function(){        
  olList.appendChild(oA);
  num=-5;
  count=0;
  oA.onclick=function(){
    var oScript=document.createElement("script");
    oScript.src="json/music-2.json"; //调用json格式的音乐
    olList.appendChild(oScript);
    
    //点击一次后循环的内容变化 
    num+=5;
    count+=5;
  } 
}

function fn1(data){
  var html="";
  var oUl=document.createElement("ul");
  for(var i=num;i<count;i++){
    html+="<li><span>"+data.list[i].index+"</span><a href="+data.list[i].url+">"+data.list[i].title+"--"+data.list[i].singer+"</a><span style="+"display:none"+">"+data.list[i].picture+"</span></li>";
  }
  oUl.innerHTML=html;
  olList.appendChild(oUl);
  olList.appendChild(oA);

  commonPlay();
}

//3.公共的点击播放设置
function commonPlay(){
  //(1).点击每个li
  $(".right .song-list li").each(function(){
    $(this).click(function(event){
      event.preventDefault();

      //a.得到歌曲src并播放
      var oSrc=this.childNodes[1].href;
      console.log(oSrc);
      oAudio.src=oSrc;
      oAudio.play();
      oPlay();

      //b.获取封面,并旋转children("span:eq(1)").
      var cover=$(this).children("span:eq(1)").text();
      console.log(cover);
      $(".song-cover img").attr("src",cover);
      $(".song-cover img").addClass("runing");

      //d.歌曲名字显示
      var songInfo=$(this).children("a").text();
      $(".song-info").text(songInfo);

      //c.当前播放列表状态
      $(this).parent().parent().find("li").removeClass("active");
      $(this).addClass("active");

	    //d.歌词切换
	    $(".lyric-show").remove();
	    $(".no-lrc").remove();
		var lyricAddress=$(this).children("span:eq(2)").text();//获取歌词地址 
		if(lyricAddress!=""){
			var htmlobj=$.ajax({url:lyricAddress,async:false}); //获取lyricAddress内容并赋值
			lyric=htmlobj.responseText;
			parseLyric(lyric);//调用显示歌词的函数
		}else{
			var noLrc=$("<a class="+"no-lrc"+">暂无歌词</a>");
			$(".song-lyric").append(noLrc);
		}
    });
  });
}

//1.播放和暂停
$(".play").click(function(){
	times();
	var allTime=Math.ceil(oAudio.duration*1000);
	var playedTime=oAudio.currentTime*1000;
	var playedS=Math.floor((playedTime*350)/allTime)+"px";
    var time=Math.ceil((allTime-playedTime)*350000/allTime);
	if(mark==0){
		oPlay();
        $("#s-pro").animate({width:"350"},allTime,"linear");
        $(".wrap-progress .btn").animate({left:"350"},allTime,"linear");
	}else{
		oPause();
		$("#s-pro").stop();
		$("#s-pro").css("width",playedS); 
        $(".wrap-progress .btn").stop();
        $(".wrap-progress .btn").css("left",playedS);
        clearInterval(timer);   
	}
}) 	

//3.下一曲
$(".next").click(function(){
	//d.当前播放歌曲下标
    var index=$(".active").children("span:eq(0)").text()-1;

	var oSrc=$(".right .song-list ol li").eq(index+1).children("a").attr("href");
    oAudio.src=oSrc;
    oPlay();
   
    //歌曲名字
    var songInfo=$(".right .song-list ol li").eq(index+1).children("a").text();
    $(".song-info").text(songInfo);
    
    //歌曲列表当前状态
    $(".right .song-list ol li").each(function(){
	    $(this).removeClass("active");
	});
	$(".right .song-list ol li").eq(index+1).addClass("active");

	//封面
	var cover=$(".right .song-list ol li").eq(index+1).children("span:eq(1)").text();
	$(".song-cover img").attr("src",cover);

	//歌词
	$(".lyric-show").remove();
    $(".no-lrc").remove();
	var lyricAddress=$(".right .song-list ol li").eq(index+1).children("span:eq(2)").text();//获取歌词地址 
	if(lyricAddress!=""){
		var htmlobj=$.ajax({url:lyricAddress,async:false}); //获取lyricAddress内容并赋值
		lyric=htmlobj.responseText;
		parseLyric(lyric);//调用显示歌词的函数
	}else{
		var noLrc=$("<a class="+"no-lrc"+">暂无歌词</a>");
		$(".song-lyric").append(noLrc);
	}
});
//4.上一曲
$(".prev").click(function(){
	var index=$(".active").children("span:eq(0)").text()-1;
	if(index>0){

		var oSrc=$(".right .song-list ol li").eq(index-1).children("a").attr("href");
	    oAudio.src=oSrc;
	    oPlay();
		//歌曲名字
	    var songInfo=$(".right .song-list ol li").eq(index-1).children("a").text();
	    $(".song-info").text(songInfo);
	    
	    //歌曲列表当前状态
	    $(".right .song-list ol li").each(function(){
		    $(this).removeClass("active");
		});
		$(".right .song-list ol li").eq(index-1).addClass("active");

		//封面
		var cover=$(".right .song-list ol li").eq(index-1).children("span:eq(1)").text();
		$(".song-cover img").attr("src",cover);

		//歌词
		$(".lyric-show").remove();
	    $(".no-lrc").remove();
		var lyricAddress=$(".right .song-list ol li").eq(index-1).children("span:eq(2)").text();//获取歌词地址 
		if(lyricAddress!=""){
			var htmlobj=$.ajax({url:lyricAddress,async:false}); //获取lyricAddress内容并赋值
			lyric=htmlobj.responseText;
			parseLyric(lyric);//调用显示歌词的函数
		}else{
			var noLrc=$("<a class="+"no-lrc"+">暂无歌词</a>");
			$(".song-lyric").append(noLrc);
		}
    }
});

//5.喜欢
var like=false;
$(".like").click(function(){
	if(like==false){
	    $(this).css("background","url(img/like2.png) no-repeat");
	    like=true;	
	}else{
        $(this).css("background","url(img/like.png) no-repeat");
        like=false;
	}
});

//6.单曲循环和顺序播放
oOrder();
$(".order").click(function(){
	oAudio.loop;
    $(this).css("display","none");
    $(".loop").css("display","block");
    oProgress();
});
$(".loop").click(function(){
	oOrder();
    $(this).css("display","none");
    $(".order").css("display","block");
    oProgress();
});
function oOrder(){
	oAudio.addEventListener("ended",function(){
		var index=$(".active").children("span:eq(0)").text()-1;
		console.log(index);
	    var oSrc=$(".right .song-list ol li").eq(index+1).children("a").attr("href");
		oAudio.src=oSrc;
	    oPlay();

		//歌曲名字
        var songInfo=$(".right .song-list ol li").eq(index+1).children("a").text();
        $(".song-info").text(songInfo);

		//歌曲列表当前状态
	    $(".right .song-list ol li").each(function(){
		    $(this).removeClass("active");
		});
		$(".right .song-list ol li").eq(index+1).addClass("active");

		//封面
		var cover=$(".right .song-list ol li").eq(index+1).children("span:eq(1)").text();
		$(".song-cover img").attr("src",cover);

		//歌词
		$(".lyric-show").remove();
	    $(".no-lrc").remove();
		var lyricAddress=$(".right .song-list ol li").eq(index+1).children("span:eq(2)").text();//获取歌词地址 
		if(lyricAddress!=""){
			var htmlobj=$.ajax({url:lyricAddress,async:false}); //获取lyricAddress内容并赋值
			lyric=htmlobj.responseText;
			parseLyric(lyric);//调用显示歌词的函数
		}else{
			var noLrc=$("<a class="+"no-lrc"+">暂无歌词</a>");
			$(".song-lyric").append(noLrc);
		}
	});
}

//7.音量
var vol="isMuted";
var vols=$(".vols");
$("#v-pro").css("width","32px");
$(".vol-btn").css("left","32px");
oAudio.volume=0.4;
//是否静音
$(".vol-icon").click(function(){
	if(vol=="isMuted"){
		oAudio.muted=true;
		vol="notMoted";
		$("#v-pro").css("width",0);
        $(".vol-btn").css("left",0);
		$(".muted").css("display","block");
	}else{
        oAudio.muted=false;
        vol="isMuted";
        var curVol=oAudio.volume;
        if(curVol==1){
			$("#v-pro").css("width","72px");
	        $(".vol-btn").css("left","72px");
        }else{
        	for(var i=0;i<vols.length-1;i++){
	        	$("#v-pro").css("width",curVol/2*160+"px");
	            $(".vol-btn").css("left",curVol/2*160+"px");
            }
        }
        $(".muted").css("display","none");
	}  
});
for(var i=0;i<vols.length-1;i++){
	vols[i].onclick=function(){
		var n=$(this).index();
		$("#v-pro").css("width",16*n+"px");
        $(".vol-btn").css("left",16*n+"px");
        oAudio.volume=0.2*n;
    };
}
$(".vol-click5").click(function(){
	$("#v-pro").css("width","72px");
	$(".vol-btn").css("left","72px");
	oAudio.volume=1;
});

//8搜索功能
$(".search input").focus(function(){
	$(this).val("");
});
$(".search input").blur(function(){
	if($(this).attr("value")==""){
		$(this).val("在此搜索");
	}
});

//9.下载功能
$('.download').click(function(){
    $(".download a").attr("href",oAudio.src);
});

//10.显示歌词
$(".look-lrc").click(function(){
	$(this).css("display","none");
	$(".song-cover").css("display","none");
	$(".song-lyric").css("display","block");
});
//获取歌词地址
var lyricAddress=$(".active").children("span:eq(2)").text();
//获取lyricAddress内容并赋值
htmlobj=$.ajax({url:lyricAddress,async:false}); //获取test1.txt内容并赋值
lyric=htmlobj.responseText;
parseLyric(lyric);//调用显示歌词的函数

function parseLyric(text) {
    oLyric= text.split('\r\n'); //先按行分割
    var rows = oLyric.length; //获取歌词行数
    var html="";
    for(i=0;i<rows;i++) {
        var str=oLyric[i];//遍历每一行
        var reg=/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g;//匹配中括号及中括号中内容
        var pattern=str.match(reg);
        var lyricS=str.replace(pattern,"")//将中括号及内容替换为空字符
        if(pattern!=null){
          html+="<p>"+lyricS+"</p><br/>";
        }   
    }
    //创建div
    var lrcDiv=$("<div class="+"lyric-show"+">"+html+"</div>");
    $(".song-lyric").append(lrcDiv);
}
$(".song-lyric").click(function(){
	$(this).css("display","none");
	$(".look-lrc").css("display","block");
	$(".song-cover").css("display","block");
});

//1.播放
function oPlay(){
    oAudio.play();
	$(".play").addClass("pause");
    mark=1;
    $(".play").removeClass("play");

    //封面旋转
    $(".song-cover img").addClass("runing");
    times();
    oProgress();
}

//2.暂停
function oPause(){
    oAudio.pause();
	$(".pause").addClass("play");
	mark=0;
	$(".pause").removeClass("pause");
	//封面停止旋转
	$(".song-cover img").removeClass("runing");	
}

//5.当前列表播放状态
function listState(){
	$(".right li").each(function(){
	    $(this).removeClass("active");
	});
	$(this).addClass("active");
}

//6.播放进度条
function oProgress(){
	oAudio.addEventListener("canplay",function(){
	var allTime=Math.ceil(oAudio.duration*1000);
    //初始化 
        $("#s-pro").css("width","0px");
	    $("#s-pro").stop();
	   
	    $(".wrap-progress .btn").stop();
	    $(".wrap-progress .btn").css("left","0px");
	    //进度条变化
	    $("#s-pro").animate({width:"340px"},allTime,"linear");
	    $(".wrap-progress .btn").animate({left:"340px"},allTime,"linear");	
	})
}
//7.总时间和当前时间
times();
function times(){
	timer=setInterval(function(){
		var totalTime=oAudio.duration;
		var curTime=oAudio.currentTime;
		totalMin=Math.floor(totalTime/60);
		totalSe=Math.floor(totalTime%60);
		curMin=Math.floor(curTime/60);
		curSe=Math.floor(curTime%60);
		if(totalSe<10){
			totalSe="0"+totalSe;
		}
		if(curSe<10){
			curSe="0"+curSe;
		}
        $(".cur-time").text("0"+curMin+":"+curSe);
		$(".total-time").text("/"+"0"+totalMin+":"+totalSe);	
	},1);
}
