//初始状态
var oAudio=$("#audio").get(0);
var mark=0;//当前播放状态为暂停
$(".song-info").text("五月天 - 如果我们不曾相遇");


//1.播放和暂停
$(".play").click(function(){
	times();
	var allTime=Math.ceil(oAudio.duration*1000);
	var playedTime=oAudio.currentTime*1000;
	var playedS=Math.floor((playedTime*350)/allTime)+"px";
    var time=Math.ceil((allTime-playedTime)*350000/allTime);
	if(mark==0){
		oPlay();
        showSongInfo();
        $("#s-pro").animate({width:"350"},allTime,"linear");
        $(".wrap-progress .btn").animate({left:"350"},allTime,"linear");
	}else{
		oPause();
		$("#s-pro").stop();
		$("#s-pro").css("width",playedS); 
        $(".wrap-progress .btn").stop();
        $(".wrap-progress .btn").css("left",playedS);
        clearInterval(timer);
        showSongCover();
        listState();
	}
    showSongCover();
    listState();
}) 	

//2.列表音乐
var index=0;
$(".right .song-list ol li").click(function(){
    index=$(this).index(); 
    var oSrc=$(this).attr("dataSrc");
    oAudio.src=oSrc;
    oPlay();
    showSongInfo();
    showSongCover();
	listState();
	oProgress();
});

//3.下一曲
$(".next").click(function(){
	if(index<11){
		index++;
	}else{
		index=-1;
		index++;
	}
	var oSrc=$(".right .song-list ol li").eq(index).attr("dataSrc");
	oAudio.src=oSrc;
    oPlay();
    showSongInfo();
    showSongCover();
    listState();
    oProgress();
});
function  next(){

}

//4.上一曲
$(".prev").click(function(){
	if(index>0){
		index--;	
	}else{
		index=12;
		index--;
	}
	var oSrc=$(".right .song-list ol li").eq(index).attr("dataSrc");
	oAudio.src=oSrc;
    oPlay();
    showSongInfo();
    showSongCover();
    listState();
    oProgress();
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
	    if(index<11){
		    var oSrc=$(".right .song-list ol li").eq(index+1).attr("dataSrc");
			oAudio.src=oSrc;
		    oPlay();
		    //当前播放歌曲列表状态
			$(".right .song-list ol li").each(function(){
			    $(this).removeClass("active");
			});
			$(".right .song-list ol li").eq(index+1).addClass("active");
	        //歌名
			var songInfo=$("li a").eq(index+1).text();
	        $(".song-info").text(songInfo);
	        //封面
	        coverSrc="img/"+(index+2)+".jpg";
	        $(".song-cover img").attr("src",coverSrc);
	    }else{
	    	index=-1;
	    	index++;
	    	var oSrc=$(".right .song-list ol li").eq(index).attr("dataSrc");
			oAudio.src=oSrc;
		    oPlay();
		    listState();
		    showSongInfo();
			showSongCover();
	    }
	        oProgress();
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
    window.location.href= oAudio.src;  
});


//10.显示歌词
$(".song-cover").click(function(){
	$(this).css("display","none");
	$(".song-lyric").css("display","block");
});
$(".song-lyric").click(function(){
	$(this).css("display","none");
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
}

//2.暂停
function oPause(){
    oAudio.pause();
	$(".pause").addClass("play");
	mark=0;
	$(".pause").removeClass("pause");
	//封面停止旋转
	$(".song-cover img").removeClass("runing");
	//进度条停止
	
}

//3.歌曲名字展示
function showSongInfo(){
    var songInfo=$("li a").eq(index).text();
    $(".song-info").text(songInfo);
}

//4.歌曲封面展示
function showSongCover(){
	coverSrc="img/"+(index+1)+".jpg";
    $(".song-cover img").attr("src",coverSrc);
}

//5.当前列表播放状态
function listState(){
	$(".right .song-list ol li").each(function(){
	    $(this).removeClass("active");
	});
	$(".right .song-list ol li").eq(index).addClass("active");
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
